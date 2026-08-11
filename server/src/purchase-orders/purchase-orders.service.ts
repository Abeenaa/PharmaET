import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from './dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: DatabaseService) {}

  async create(data: CreatePurchaseOrderDto, userId: string) {
    // Validate supplier exists and is active
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: data.supplier_id },
    });

    if (!supplier || !supplier.is_active) {
      throw new BadRequestException('Supplier not found or inactive');
    }

    // Validate medicines exist
    for (const item of data.items) {
      const medicine = await this.prisma.medicine.findUnique({
        where: { id: item.medicine_id },
      });

      if (!medicine) {
        throw new BadRequestException(`Medicine not found: ${item.medicine_id}`);
      }

      if (item.quantity_ordered <= 0) {
        throw new BadRequestException('Quantity must be positive');
      }
    }

    // Generate PO number
    const po_number = `PO-${new Date().getFullYear()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Create PO with items
    return this.prisma.purchaseOrder.create({
      data: {
        po_number,
        supplier_id: data.supplier_id,
        branch_id: data.branch_id,
        created_by: userId,
        status: 'DRAFT',
        po_items: {
          create: data.items.map((item) => ({
            medicine_id: item.medicine_id,
            quantity_ordered: item.quantity_ordered,
          })),
        },
      },
      include: {
        supplier: true,
        po_items: {
          include: {
            medicine: true,
          },
        },
        created_user: {
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

    return this.prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: true,
        po_items: {
          include: {
            medicine: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(id: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        po_items: {
          include: {
            medicine: true,
          },
        },
        created_user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!po) {
      throw new NotFoundException('Purchase order not found');
    }

    return po;
  }

  async update(id: string, data: UpdatePurchaseOrderDto) {
    const po = await this.findById(id);

    if (po.status !== 'DRAFT') {
      throw new BadRequestException('Can only update DRAFT purchase orders');
    }

    // Delete existing items and create new ones
    await this.prisma.pOItem.deleteMany({
      where: { po_id: id },
    });

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: {
        supplier_id: data.supplier_id,
        po_items: {
          create: data.items.map((item) => ({
            medicine_id: item.medicine_id,
            quantity_ordered: item.quantity_ordered,
          })),
        },
        updated_at: new Date(),
      },
      include: {
        supplier: true,
        po_items: {
          include: {
            medicine: true,
          },
        },
      },
    });
  }

  async submit(id: string) {
    const po = await this.findById(id);

    if (po.status !== 'DRAFT') {
      throw new BadRequestException('Can only submit DRAFT purchase orders');
    }

    if (po.po_items.length === 0) {
      throw new BadRequestException('Purchase order must have at least one item');
    }

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: {
        status: 'PENDING',
        updated_at: new Date(),
      },
      include: {
        supplier: true,
        po_items: {
          include: {
            medicine: true,
          },
        },
      },
    });
  }

  async cancel(id: string) {
    const po = await this.findById(id);

    if (po.status === 'RECEIVED' || po.status === 'CANCELLED') {
      throw new BadRequestException(`Cannot cancel ${po.status} purchase order`);
    }

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updated_at: new Date(),
      },
      include: {
        supplier: true,
        po_items: {
          include: {
            medicine: true,
          },
        },
      },
    });
  }
}
