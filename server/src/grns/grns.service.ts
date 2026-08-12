import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateGRNDto, UpdateGRNDto, FinalizeGRNDto } from './dto';
import { v4 as uuidv4 } from 'uuid';
import { CONFIG } from '../config/constants';

@Injectable()
export class GRNsService {
  constructor(private prisma: DatabaseService) {}

  async create(data: CreateGRNDto, userId: string, user?: any) {
    // Validate PO exists
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id: data.po_id },
      include: {
        po_items: true,
      },
    });

    if (!po) {
      throw new BadRequestException('Purchase order not found');
    }

    // Validate user has access to PO's branch
    if (user && user.role !== 'SUPER_ADMIN' && user.branch_id !== po.branch_id) {
      throw new BadRequestException('Cannot create GRN for PO in other branches');
    }

    if (po.status !== 'PENDING') {
      throw new BadRequestException('PO must be in PENDING status');
    }

    // Validate PO has items
    if (po.po_items.length === 0) {
      throw new BadRequestException('PO must have items before creating GRN');
    }

    // Generate GRN number
    const grn_number = `GRN-${new Date().getFullYear()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Create GRN
    return this.prisma.gRN.create({
      data: {
        grn_number,
        po_id: data.po_id,
        branch_id: po.branch_id,
        received_by: userId,
        status: 'DRAFT',
      },
      include: {
        purchase_order: {
          include: {
            po_items: {
              include: {
                medicine: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(branchId?: string) {
    const where: any = {};

    if (branchId) {
      where.branch_id = branchId;
    }

    return this.prisma.gRN.findMany({
      where,
      include: {
        purchase_order: {
          include: {
            supplier: true,
            po_items: {
              include: {
                medicine: true,
              },
            },
          },
        },
        grn_items: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(id: string) {
    const grn = await this.prisma.gRN.findUnique({
      where: { id },
      include: {
        purchase_order: {
          include: {
            supplier: true,
            po_items: {
              include: {
                medicine: true,
              },
            },
          },
        },
        grn_items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!grn) {
      throw new NotFoundException('GRN not found');
    }

    return grn;
  }

  async addItem(grnId: string, poItemId: string, data: any) {
    const grn = await this.findById(grnId);

    if (grn.status !== 'DRAFT') {
      throw new BadRequestException('Can only add items to DRAFT GRNs');
    }

    // Validate PO item
    const poItem = grn.purchase_order.po_items.find(
      (item) => item.id === poItemId,
    );

    if (!poItem) {
      throw new BadRequestException('PO item not found');
    }

    // Validate quantity doesn't exceed PO quantity - check all GRN items for this PO item
    const existingGRNItems = await this.prisma.gRNItem.findMany({
      where: {
        grn_id: grnId,
        po_item_id: poItemId,
      },
    });

    const totalReceived =
      existingGRNItems.reduce((sum, item) => sum + item.quantity_received, 0) + data.quantity_received;

    if (totalReceived > poItem.quantity_ordered) {
      throw new BadRequestException(
        'Received quantity exceeds purchase order quantity',
      );
    }

    return this.prisma.gRNItem.create({
      data: {
        grn_id: grnId,
        po_item_id: poItemId,
        quantity_received: data.quantity_received,
        batch_number: data.batch_number,
        expiry_date: new Date(data.expiry_date),
      },
    });
  }

  async finalize(grnId: string, user?: any) {
    const grn = await this.findById(grnId);

    // Validate user has access to GRN's branch
    if (user && user.role !== 'SUPER_ADMIN' && user.branch_id !== grn.branch_id) {
      throw new BadRequestException('Cannot finalize GRN from other branches');
    }

    if (grn.status !== 'DRAFT') {
      throw new BadRequestException('GRN is already finalized');
    }

    if (grn.grn_items.length === 0) {
      throw new BadRequestException('GRN must have at least one item');
    }

    // Wrap in transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      // Create batches and update PO items
      for (const grnItem of grn.grn_items) {
        const poItem = grn.purchase_order.po_items.find(
          (item) => item.id === grnItem.po_item_id,
        );

        if (!poItem) {
          throw new BadRequestException('PO item not found for GRN item');
        }

        // Create batch with calculated status
        await tx.medicineBatch.create({
          data: {
            medicine_id: poItem.medicine_id,
            batch_number: grnItem.batch_number,
            quantity: grnItem.quantity_received,
            expiry_date: grnItem.expiry_date,
            status: this.calculateBatchStatus(grnItem.expiry_date),
          },
        });

        // Update PO item quantity_received
        await tx.pOItem.update({
          where: { id: grnItem.po_item_id },
          data: {
            quantity_received: {
              increment: grnItem.quantity_received,
            },
          },
        });
      }

      // Update PO status to RECEIVED
      await tx.purchaseOrder.update({
        where: { id: grn.po_id },
        data: {
          status: 'RECEIVED',
        },
      });

      // Finalize GRN
      return tx.gRN.update({
        where: { id: grnId },
        data: {
          status: 'FINALIZED',
          received_at: new Date(),
        },
        include: {
          purchase_order: {
            include: {
              po_items: {
                include: {
                  medicine: true,
                },
              },
            },
          },
          grn_items: true,
        },
      });
    });
  }

  private calculateBatchStatus(expiryDate: Date) {
    const today = new Date();
    const daysUntilExpiry = Math.floor(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilExpiry < 0) {
      return 'EXPIRED';
    }

    if (daysUntilExpiry <= CONFIG.EXPIRING_SOON_DAYS) {
      return 'EXPIRING_SOON';
    }

    return 'ACTIVE';
  }
}
