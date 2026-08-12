import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: DatabaseService) {}

  async generateSalesReport(
    branchId: string,
    startDate?: Date,
    endDate?: Date,
    medicineId?: string,
    categoryId?: string,
  ) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
    const end = endDate || new Date();

    const where: any = {
      branch_id: branchId,
      created_at: {
        gte: start,
        lte: end,
      },
    };

    const sales = await this.prisma.sale.findMany({
      where,
      include: {
        sale_items: {
          include: {
            medicine: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    // Calculate totals
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + Number(sale.total_amount),
      0,
    );
    const transactionCount = sales.length;
    const avgTransactionValue = transactionCount > 0 ? totalRevenue / transactionCount : 0;

    // Group by medicine
    const medicineStats: any = {};
    for (const sale of sales) {
      for (const item of sale.sale_items) {
        if (medicineId && item.medicine_id !== medicineId) continue;
        if (categoryId && item.medicine.category_id !== categoryId) continue;

        if (!medicineStats[item.medicine_id]) {
          medicineStats[item.medicine_id] = {
            medicine_id: item.medicine_id,
            medicine_name: item.medicine.name,
            category_name: item.medicine.category?.name,
            quantity_sold: 0,
            revenue: 0,
            transactions: 0,
          };
        }

        medicineStats[item.medicine_id].quantity_sold += item.quantity;
        medicineStats[item.medicine_id].revenue += Number(item.unit_price) * item.quantity;
        medicineStats[item.medicine_id].transactions++;
      }
    }

    return {
      period: {
        start_date: start,
        end_date: end,
      },
      summary: {
        total_revenue: totalRevenue,
        transaction_count: transactionCount,
        avg_transaction_value: avgTransactionValue,
      },
      medicine_details: Object.values(medicineStats),
    };
  }

  async generateInventoryReport(
    branchId: string,
    medicineId?: string,
    categoryId?: string,
  ) {
    const where: any = {};
    if (categoryId) {
      where.category_id = categoryId;
    }
    if (medicineId) {
      where.id = medicineId;
    }

    const medicines = await this.prisma.medicine.findMany({
      where,
      include: {
        category: true,
        batches: true,
      },
    });

    const reportItems = medicines.map((medicine) => {
      const activeBatches = medicine.batches.filter((b) => b.status === 'ACTIVE');
      const expiringBatches = medicine.batches.filter((b) => b.status === 'EXPIRING_SOON');
      const expiredBatches = medicine.batches.filter((b) => b.status === 'EXPIRED');

      return {
        medicine_id: medicine.id,
        medicine_name: medicine.name,
        category_name: medicine.category?.name,
        sku: medicine.sku,
        barcode: medicine.barcode,
        total_stock: medicine.batches.reduce((sum, batch) => sum + batch.quantity, 0),
        batch_count: medicine.batches.length,
        batch_details: {
          active: {
            count: activeBatches.length,
            total_quantity: activeBatches.reduce((sum, b) => sum + b.quantity, 0),
          },
          expiring_soon: {
            count: expiringBatches.length,
            total_quantity: expiringBatches.reduce((sum, b) => sum + b.quantity, 0),
          },
          expired: {
            count: expiredBatches.length,
            total_quantity: expiredBatches.reduce((sum, b) => sum + b.quantity, 0),
          },
        },
        batches: medicine.batches.map((batch) => ({
          batch_number: batch.batch_number,
          quantity: batch.quantity,
          expiry_date: batch.expiry_date,
          status: batch.status,
        })),
      };
    });

    return {
      report_date: new Date(),
      total_medicines: medicines.length,
      total_stock: reportItems.reduce((sum, item) => sum + item.total_stock, 0),
      items: reportItems,
    };
  }
}
