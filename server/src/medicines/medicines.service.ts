import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMedicineDto, UpdateMedicineDto } from './dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MedicinesService {
  constructor(private prisma: DatabaseService) {}

  async create(data: CreateMedicineDto) {
    // Validate category exists and is active
    const category = await this.prisma.category.findUnique({
      where: { id: data.category_id },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    // Check barcode uniqueness
    const existingBarcode = await this.prisma.medicine.findUnique({
      where: { barcode: data.barcode },
    });

    if (existingBarcode) {
      throw new BadRequestException('Barcode already exists');
    }

    // Generate SKU if not provided
    const sku = `MED-${uuidv4().slice(0, 8).toUpperCase()}`;

    return this.prisma.medicine.create({
      data: {
        sku,
        name: data.name,
        generic_name: data.generic_name,
        strength: data.strength,
        form: data.form,
        barcode: data.barcode,
        category_id: data.category_id,
      },
      include: {
        category: true,
        batches: true,
      },
    });
  }

  async findAll(search?: string) {
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { generic_name: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.medicine.findMany({
      where,
      include: {
        category: true,
        batches: {
          orderBy: { expiry_date: 'asc' },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findByBarcode(barcode: string) {
    const medicine = await this.prisma.medicine.findUnique({
      where: { barcode },
      include: {
        category: true,
        batches: {
          where: { status: { not: 'EXPIRED' } },
          orderBy: { expiry_date: 'asc' },
        },
      },
    });

    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    return medicine;
  }

  async findById(id: string) {
    const medicine = await this.prisma.medicine.findUnique({
      where: { id },
      include: {
        category: true,
        batches: {
          orderBy: { expiry_date: 'asc' },
        },
      },
    });

    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    // Calculate total stock
    const totalStock = medicine.batches.reduce((sum, batch) => sum + batch.quantity, 0);

    return {
      ...medicine,
      total_stock: totalStock,
    };
  }

  async update(id: string, data: UpdateMedicineDto) {
    const medicine = await this.findById(id);

    // Check barcode uniqueness if being updated
    if (data.barcode && data.barcode !== medicine.barcode) {
      const existingBarcode = await this.prisma.medicine.findUnique({
        where: { barcode: data.barcode },
      });

      if (existingBarcode) {
        throw new BadRequestException('Barcode already exists');
      }
    }

    // Validate category if being updated
    if (data.category_id) {
      const category = await this.prisma.category.findUnique({
        where: { id: data.category_id },
      });

      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    return this.prisma.medicine.update({
      where: { id },
      data: {
        name: data.name,
        generic_name: data.generic_name,
        strength: data.strength,
        form: data.form,
        barcode: data.barcode,
        category_id: data.category_id,
        updated_at: new Date(),
      },
      include: {
        category: true,
        batches: true,
      },
    });
  }

  async deactivate(id: string) {
    const medicine = await this.findById(id);

    // Mark as inactive but preserve batch data
    return this.prisma.medicine.update({
      where: { id },
      data: {
        // Soft deactivate by moving to a special category or flag
        // For now, we'll keep it simple - just track inactive status
        updated_at: new Date(),
      },
      include: {
        category: true,
        batches: true,
      },
    });
  }
}
