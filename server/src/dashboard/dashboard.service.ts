import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: DatabaseService) {}

  async getSummary(branchId: string, date?: Date) {
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Today's sales
    const todaySales = await this.prisma.sale.findMany({
      where: {
        branch_id: branchId,
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        sale_items: true,
      },
    });

    const totalSales = todaySales.reduce(
      (sum, sale) => sum + Number(sale.total_amount),
      0,
    );

    // Top 5 selling medicines
    const topMedicines = await this.prisma.saleItem.groupBy({
      by: ['medicine_id'],
      where: {
        sale: {
          branch_id: branchId,
          created_at: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    // Get medicine details for top sellers
    const topMedicineDetails = await Promise.all(
      topMedicines.map(async (item) => {
        const medicine = await this.prisma.medicine.findUnique({
          where: { id: item.medicine_id },
          include: { category: true },
        });
        return {
          ...medicine,
          quantity_sold: item._sum.quantity,
        };
      }),
    );

    return {
      date: targetDate,
      total_sales: totalSales,
      transaction_count: todaySales.length,
      top_selling_medicines: topMedicineDetails,
    };
  }

  async getInventoryStatus(branchId: string) {
    // Validate branch exists
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    const medicines = await this.prisma.medicine.findMany({
      include: {
        batches: {
          where: {
            status: { not: 'EXPIRED' },
          },
        },
        category: true,
      },
    });

    const totalMedicines = medicines.length;
    let lowStockCount = 0;
    let expiringCount = 0;
    let expiredCount = 0;
    const stockByCategory: any = {};

    for (const medicine of medicines) {
      const totalStock = medicine.batches.reduce((sum, batch) => sum + batch.quantity, 0);

      if (totalStock < 50) {
        lowStockCount++;
      }

      // Count expiring and expired batches
      for (const batch of medicine.batches) {
        if (batch.status === 'EXPIRING_SOON') {
          expiringCount++;
        } else if (batch.status === 'EXPIRED') {
          expiredCount++;
        }
      }

      // Group by category
      const categoryName = medicine.category?.name || 'Uncategorized';
      if (!stockByCategory[categoryName]) {
        stockByCategory[categoryName] = 0;
      }
      stockByCategory[categoryName] += totalStock;
    }

    return {
      total_medicines: totalMedicines,
      low_stock_count: lowStockCount,
      expiring_soon_count: expiringCount,
      expired_count: expiredCount,
      stock_by_category: stockByCategory,
    };
  }

  async getAlerts(branchId: string) {
    const lowStockAlerts = await this.prisma.alert.findMany({
      where: {
        branch_id: branchId,
        alert_type: 'LOW_STOCK',
        is_read: false,
      },
      include: {
        medicine: true,
      },
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    const expiringAlerts = await this.prisma.alert.findMany({
      where: {
        branch_id: branchId,
        alert_type: 'EXPIRING_SOON',
        is_read: false,
      },
      include: {
        medicine: true,
      },
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    return {
      low_stock_alerts: lowStockAlerts,
      expiring_soon_alerts: expiringAlerts,
    };
  }
}
