import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SyncService {
  constructor(private prisma: DatabaseService) {}

  async getAllOfflineData(branchId: string) {
    // Get all medicines with batches
    const medicines = await this.prisma.medicine.findMany({
      include: {
        category: true,
        batches: true,
      },
    });

    // Get all categories
    const categories = await this.prisma.category.findMany({
      where: { is_active: true },
    });

    // Get all suppliers (active)
    const suppliers = await this.prisma.supplier.findMany({
      where: { is_active: true },
    });

    // Get branch info
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });

    return {
      branch,
      medicines,
      categories,
      suppliers,
      sync_timestamp: new Date(),
      version: 1,
    };
  }

  async syncOfflineSales(data: any) {
    // Validate offline sale data
    if (!data.transaction_id || !data.items || data.items.length === 0) {
      throw new BadRequestException('Invalid offline sale data');
    }

    // Check if sale already synced
    const existingSale = await this.prisma.sale.findUnique({
      where: { transaction_id: data.transaction_id },
    });

    if (existingSale) {
      return {
        status: 'already_synced',
        message: 'Sale already recorded',
        sale_id: existingSale.id,
      };
    }

    // Validate stock availability and create sale atomically
    return this.prisma.$transaction(async (tx) => {
      const validationErrors: string[] = [];
      
      for (const item of data.items) {
        const medicine = await tx.medicine.findUnique({
          where: { id: item.medicine_id },
          include: {
            batches: {
              where: { status: { not: 'EXPIRED' } },
            },
          },
        });

        if (!medicine) {
          validationErrors.push(`Medicine not found: ${item.medicine_id}`);
          continue;
        }

        const totalStock = medicine.batches.reduce((sum, batch) => sum + batch.quantity, 0);
        if (totalStock < item.quantity) {
          validationErrors.push(
            `Insufficient stock for medicine. Requested: ${item.quantity}, Available: ${totalStock}`,
          );
        }
      }

      if (validationErrors.length > 0) {
        return {
          status: 'conflict',
          message: 'Stock conflict detected',
          errors: validationErrors,
        };
      }

      // Create sale record with items
      const sale = await tx.sale.create({
        data: {
          transaction_id: data.transaction_id,
          branch_id: data.branch_id,
          cashier_id: data.cashier_id,
          total_amount: data.total_amount,
          created_at: new Date(data.created_at),
          sale_items: {
            create: data.items.map((item: any) => ({
              medicine_id: item.medicine_id,
              batch_id: item.batch_id,
              quantity: item.quantity,
              unit_price: item.unit_price,
            })),
          },
        },
        include: {
          sale_items: true,
        },
      });

      return {
        status: 'synced',
        message: 'Sale synced successfully',
        sale_id: sale.id,
      };
    });
  }

  async getSyncStatus() {
    // Check for pending/failed offline syncs in a real implementation
    // For now, return basic status
    return {
      status: 'synced',
      pending_count: 0,
      failed_count: 0,
      last_sync: new Date(),
    };
  }
}
