import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateStockAdjustmentDto } from './dto';

@Injectable()
export class StockAdjustmentsService {
  constructor(private prisma: DatabaseService) {}

  async create(data: CreateStockAdjustmentDto, userId: string) {
    // Validate branch exists
    const branch = await this.prisma.branch.findUnique({
      where: { id: data.branch_id },
    });

    if (!branch || !branch.is_active) {
      throw new BadRequestException('Branch not found or inactive');
    }

    // Validate medicine exists
    const medicine = await this.prisma.medicine.findUnique({
      where: { id: data.medicine_id },
    });

    if (!medicine) {
      throw new BadRequestException('Medicine not found');
    }

    // Validate quantity doesn't go negative
    const totalStock = await this.getTotalStock(data.medicine_id);
    if (totalStock + data.quantity_change < 0) {
      throw new BadRequestException(
        'Adjustment would result in negative inventory',
      );
    }

    // Create adjustment
    const adjustment = await this.prisma.stockAdjustment.create({
      data: {
        medicine_id: data.medicine_id,
        branch_id: data.branch_id,
        reason: data.reason,
        quantity_change: data.quantity_change,
        performed_by: userId,
      },
      include: {
        medicine: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return adjustment;
  }

  async findHistory(medicineId?: string, branchId?: string, limit: number = 50, offset: number = 0) {
    const where: any = {};

    if (medicineId) {
      where.medicine_id = medicineId;
    }

    if (branchId) {
      where.branch_id = branchId;
    }

    const adjustments = await this.prisma.stockAdjustment.findMany({
      where,
      include: {
        medicine: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await this.prisma.stockAdjustment.count({ where });

    return {
      data: adjustments,
      total,
      limit,
      offset,
    };
  }

  private async getTotalStock(medicineId: string): Promise<number> {
    const batches = await this.prisma.medicineBatch.findMany({
      where: {
        medicine_id: medicineId,
        status: { not: 'EXPIRED' },
      },
    });

    return batches.reduce((sum, batch) => sum + batch.quantity, 0);
  }
}
