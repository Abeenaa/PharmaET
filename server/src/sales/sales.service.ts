import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateSaleDto } from './dto';
import { v4 as uuidv4 } from 'uuid';
import { CONFIG } from '../config/constants';

@Injectable()
export class SalesService {
  constructor(private prisma: DatabaseService) {}

  async createSale(data: CreateSaleDto, cashierId: string) {
    // Validate branch and cashier
    const cashier = await this.prisma.user.findUnique({
      where: { id: cashierId },
    });

    if (!cashier || !cashier.is_active) {
      throw new BadRequestException('Cashier not found or inactive');
    }

    // Validate user has access to branch
    if (cashier.branch_id !== data.branch_id) {
      throw new BadRequestException('Cashier does not belong to this branch');
    }

    // Validate all medicines exist and have stock
    const validationErrors: string[] = [];
    const saleItems: any[] = [];

    for (const item of data.items) {
      const medicine = await this.prisma.medicine.findUnique({
        where: { id: item.medicine_id },
        include: {
          batches: {
            where: { status: { not: 'EXPIRED' } },
            orderBy: { expiry_date: 'asc' },
          },
        },
      });

      if (!medicine) {
        validationErrors.push(`Medicine not found: ${item.medicine_id}`);
        continue;
      }

      // Check if any batch is expired
      const expiredBatches = await this.prisma.medicineBatch.findMany({
        where: {
          medicine_id: item.medicine_id,
          status: 'EXPIRED',
        },
      });

      if (expiredBatches.length > 0) {
        throw new BadRequestException(
          `Cannot sell medicine with expired batches: ${medicine.name}`,
        );
      }

      // Calculate total available stock
      const totalStock = medicine.batches.reduce((sum, batch) => sum + batch.quantity, 0);

      if (totalStock < item.quantity) {
        validationErrors.push(
          `Insufficient stock for ${medicine.name}: requested ${item.quantity}, available ${totalStock}`,
        );
        continue;
      }

      // Select FEFO batches for this item
      const selectedBatches = this.selectFEFOBatches(medicine.batches, item.quantity);

      saleItems.push({
        medicine,
        requestedQuantity: item.quantity,
        unitPrice: item.unit_price,
        selectedBatches,
      });
    }

    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors.join('; '));
    }

    if (saleItems.length === 0) {
      throw new BadRequestException('No valid items in sale');
    }

    // Wrap entire sale creation in transaction to ensure atomicity
    const transactionId = `TXN-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`;

    const sale = await this.prisma.$transaction(async (tx) => {
      // Create sale record
      const newSale = await tx.sale.create({
        data: {
          transaction_id: transactionId,
          branch_id: data.branch_id,
          cashier_id: cashierId,
          total_amount: saleItems.reduce(
            (sum, item) => sum + item.requestedQuantity * item.unitPrice,
            0,
          ),
        },
      });

      // Process all sale items and batch updates atomically
      for (const saleItem of saleItems) {
        let remainingQuantity = saleItem.requestedQuantity;

        for (const batch of saleItem.selectedBatches) {
          const quantityToUse = Math.min(remainingQuantity, batch.quantity);

          // Create sale item
          await tx.saleItem.create({
            data: {
              sale_id: newSale.id,
              medicine_id: saleItem.medicine.id,
              batch_id: batch.id,
              quantity: quantityToUse,
              unit_price: saleItem.unitPrice,
            },
          });

          // Update batch quantity and status
          const newQuantity = batch.quantity - quantityToUse;
          await tx.medicineBatch.update({
            where: { id: batch.id },
            data: {
              quantity: newQuantity,
              status: this.calculateBatchStatus(batch.expiry_date),
            },
          });

          remainingQuantity -= quantityToUse;

          if (remainingQuantity === 0) break;
        }

        // Check for low-stock alerts after sale items processed
        await this.checkAndGenerateLowStockAlert(saleItem.medicine.id, data.branch_id);
      }

      return newSale;
    });

    return this.findById(sale.id);
  }

  async findById(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        sale_items: {
          include: {
            medicine: {
              include: {
                category: true,
              },
            },
            batch: true,
          },
        },
        cashier: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        branch: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }

  async findHistory(branchId?: string, limit: number = 50, offset: number = 0) {
    const where: any = {};

    if (branchId) {
      where.branch_id = branchId;
    }

    const sales = await this.prisma.sale.findMany({
      where,
      include: {
        sale_items: {
          include: {
            medicine: true,
          },
        },
        cashier: {
          select: {
            id: true,
            name: true,
          },
        },
        branch: true,
      },
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await this.prisma.sale.count({ where });

    return {
      data: sales,
      total,
      limit,
      offset,
    };
  }

  async getPOSMedicineSearch(search: string, branchId: string) {
    // Validate branch exists
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      throw new BadRequestException('Invalid branch');
    }

    const where: any = {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { generic_name: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ],
    };

    const medicines = await this.prisma.medicine.findMany({
      where,
      include: {
        category: true,
        batches: {
          where: { status: { not: 'EXPIRED' } },
          orderBy: { expiry_date: 'asc' },
        },
      },
      take: 20,
    });

    return medicines.map((medicine) => ({
      ...medicine,
      total_stock: medicine.batches.reduce((sum, batch) => sum + batch.quantity, 0),
      fefo_batch: medicine.batches[0] || null,
    }));
  }

  private selectFEFOBatches(batches: any[], quantity: number) {
    const selected: any[] = [];
    let remaining = quantity;

    // Batches are already ordered by expiry_date asc (earliest first)
    for (const batch of batches) {
      if (remaining <= 0) break;

      if (batch.quantity > 0) {
        selected.push({
          ...batch,
          quantity: Math.min(batch.quantity, remaining),
        });
        remaining -= Math.min(batch.quantity, remaining);
      }
    }

    return selected;
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

  private async checkAndGenerateLowStockAlert(medicineId: string, branchId: string) {
    const medicine = await this.prisma.medicine.findUnique({
      where: { id: medicineId },
      include: {
        batches: {
          where: { status: { not: 'EXPIRED' } },
        },
      },
    });

    if (!medicine) return;

    const totalStock = medicine.batches.reduce((sum, batch) => sum + batch.quantity, 0);

    // Check if low stock alert already exists
    const existingAlert = await this.prisma.alert.findFirst({
      where: {
        medicine_id: medicineId,
        branch_id: branchId,
        alert_type: 'LOW_STOCK',
        is_read: false,
      },
    });

    if (!existingAlert && totalStock < CONFIG.LOW_STOCK_THRESHOLD) {
      await this.prisma.alert.create({
        data: {
          medicine_id: medicineId,
          branch_id: branchId,
          alert_type: 'LOW_STOCK',
          is_read: false,
        },
      });
    }
  }
}
