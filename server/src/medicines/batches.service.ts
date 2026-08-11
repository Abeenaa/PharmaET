import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateBatchDto } from './dto/create-batch.dto';

@Injectable()
export class BatchesService {
  constructor(private prisma: DatabaseService) {}

  async create(medicineId: string, data: CreateBatchDto) {
    // Validate medicine exists
    const medicine = await this.prisma.medicine.findUnique({
      where: { id: medicineId },
    });

    if (!medicine) {
      throw new BadRequestException('Medicine not found');
    }

    // Calculate batch status
    const status = this.calculateBatchStatus(data.expiry_date);

    return this.prisma.medicineBatch.create({
      data: {
        medicine_id: medicineId,
        batch_number: data.batch_number,
        quantity: data.quantity,
        expiry_date: data.expiry_date,
        status,
      },
      include: {
        medicine: true,
      },
    });
  }

  async findByMedicineId(medicineId: string) {
    return this.prisma.medicineBatch.findMany({
      where: { medicine_id: medicineId },
      orderBy: { expiry_date: 'asc' },
    });
  }

  async findById(id: string) {
    const batch = await this.prisma.medicineBatch.findUnique({
      where: { id },
      include: {
        medicine: true,
      },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    return batch;
  }

  async updateStatus(id: string) {
    const batch = await this.findById(id);
    const newStatus = this.calculateBatchStatus(batch.expiry_date);

    if (newStatus !== batch.status) {
      return this.prisma.medicineBatch.update({
        where: { id },
        data: {
          status: newStatus,
          updated_at: new Date(),
        },
      });
    }

    return batch;
  }

  async updateQuantity(id: string, quantityChange: number) {
    const batch = await this.findById(id);
    const newQuantity = batch.quantity + quantityChange;

    if (newQuantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    return this.prisma.medicineBatch.update({
      where: { id },
      data: {
        quantity: newQuantity,
        updated_at: new Date(),
      },
    });
  }

  private calculateBatchStatus(expiryDate: Date) {
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return 'EXPIRED';
    }

    if (daysUntilExpiry <= 30) {
      return 'EXPIRING_SOON';
    }

    return 'ACTIVE';
  }

  async getActiveBatchesByMedicine(medicineId: string) {
    return this.prisma.medicineBatch.findMany({
      where: {
        medicine_id: medicineId,
        status: { not: 'EXPIRED' },
      },
      orderBy: { expiry_date: 'asc' },
    });
  }

  // Get FEFO batch - earliest expiring batch
  async getFEFOBatch(medicineId: string) {
    const batch = await this.prisma.medicineBatch.findFirst({
      where: {
        medicine_id: medicineId,
        status: { not: 'EXPIRED' },
        quantity: { gt: 0 },
      },
      orderBy: { expiry_date: 'asc' },
    });

    return batch;
  }

  async updateBatchStatus(id: string, newStatus: string) {
    return this.prisma.medicineBatch.update({
      where: { id },
      data: {
        status: newStatus as any,
        updated_at: new Date(),
      },
    });
  }
}
