import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: DatabaseService) {}

  async findAll(branchId?: string, isRead?: boolean) {
    const where: any = {};

    if (branchId) {
      where.branch_id = branchId;
    }

    if (isRead !== undefined) {
      where.is_read = isRead;
    }

    return this.prisma.alert.findMany({
      where,
      include: {
        medicine: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(id: string) {
    const alert = await this.prisma.alert.findUnique({
      where: { id },
      include: {
        medicine: true,
      },
    });

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    return alert;
  }

  async markAsRead(id: string, userId: string) {
    const alert = await this.findById(id);

    return this.prisma.alert.update({
      where: { id },
      data: {
        is_read: true,
        acknowledged_by: userId,
        acknowledged_at: new Date(),
      },
      include: {
        medicine: true,
      },
    });
  }

  async getUnreadCount(branchId: string) {
    return this.prisma.alert.count({
      where: {
        branch_id: branchId,
        is_read: false,
      },
    });
  }

  async getActiveLowStockAlerts(branchId: string) {
    return this.prisma.alert.findMany({
      where: {
        branch_id: branchId,
        alert_type: 'LOW_STOCK',
        is_read: false,
      },
      include: {
        medicine: {
          include: {
            batches: {
              where: { status: { not: 'EXPIRED' } },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getExpiringBatchAlerts(branchId: string) {
    return this.prisma.alert.findMany({
      where: {
        branch_id: branchId,
        alert_type: { in: ['EXPIRING_SOON', 'EXPIRED'] },
        is_read: false,
      },
      include: {
        medicine: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async markAllAsRead(branchId: string, userId: string) {
    return this.prisma.alert.updateMany({
      where: {
        branch_id: branchId,
        is_read: false,
      },
      data: {
        is_read: true,
        acknowledged_by: userId,
        acknowledged_at: new Date(),
      },
    });
  }
}
