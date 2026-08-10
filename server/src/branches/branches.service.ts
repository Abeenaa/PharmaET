import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateBranchDto, UpdateBranchDto } from './dto';

@Injectable()
export class BranchesService {
  constructor(private prisma: DatabaseService) {}

  async create(data: CreateBranchDto) {
    // Validate license number uniqueness
    const existing = await this.prisma.branch.findUnique({
      where: { license_number: data.license_number },
    });

    if (existing) {
      throw new BadRequestException('License number already exists');
    }

    return this.prisma.branch.create({
      data: {
        name: data.name,
        license_number: data.license_number,
        location: data.location,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        is_active: true,
      },
    });
  }

  async findAll(userId?: string, userBranchId?: string, userRole?: string) {
    // Super Admin sees all branches
    if (userRole === 'SUPER_ADMIN') {
      return this.prisma.branch.findMany({
        where: { is_active: true },
        orderBy: { created_at: 'desc' },
      });
    }

    // Non-admin users only see their own branch
    return this.prisma.branch.findMany({
      where: {
        id: userBranchId,
        is_active: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(id: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    return branch;
  }

  async update(id: string, data: UpdateBranchDto) {
    const branch = await this.findById(id);

    // Check for license number conflict if being updated
    if (data.license_number && data.license_number !== branch.license_number) {
      const existing = await this.prisma.branch.findUnique({
        where: { license_number: data.license_number },
      });

      if (existing) {
        throw new BadRequestException('License number already exists');
      }
    }

    return this.prisma.branch.update({
      where: { id },
      data: {
        name: data.name,
        license_number: data.license_number,
        location: data.location,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        is_active: data.is_active,
        updated_at: new Date(),
      },
    });
  }

  async deactivate(id: string) {
    const branch = await this.findById(id);

    // Soft deactivate - preserve all transaction history
    return this.prisma.branch.update({
      where: { id },
      data: {
        is_active: false,
        updated_at: new Date(),
      },
    });
  }
}
