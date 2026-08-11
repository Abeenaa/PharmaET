import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: DatabaseService) {}

  async create(data: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: {
        name: data.name,
        contact_person: data.contact_person,
        email: data.email,
        phone: data.phone,
        address: data.address,
        is_active: true,
      },
    });
  }

  async findAll() {
    return this.prisma.supplier.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return supplier;
  }

  async update(id: string, data: UpdateSupplierDto) {
    const supplier = await this.findById(id);

    return this.prisma.supplier.update({
      where: { id },
      data: {
        name: data.name,
        contact_person: data.contact_person,
        email: data.email,
        phone: data.phone,
        address: data.address,
        updated_at: new Date(),
      },
    });
  }

  async deactivate(id: string) {
    const supplier = await this.findById(id);

    return this.prisma.supplier.update({
      where: { id },
      data: {
        is_active: false,
        updated_at: new Date(),
      },
    });
  }
}
