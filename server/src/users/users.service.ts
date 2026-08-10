import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: DatabaseService) {}

  async create(data: CreateUserDto) {
    // Validate email uniqueness
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    // Validate branch exists
    if (data.branch_id) {
      const branch = await this.prisma.branch.findUnique({
        where: { id: data.branch_id },
      });

      if (!branch) {
        throw new BadRequestException('Branch not found');
      }
    }

    // Hash initial password
    const hashedPassword = await bcrypt.hash('DefaultPass123!', 10);

    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        password_hash: hashedPassword,
        role: data.role as any,
        branch_id: data.branch_id,
        is_active: true,
        requires_password_change: true,
      },
    });
  }

  async findAll(userId?: string, userBranchId?: string, userRole?: string) {
    const where: any = {};

    // Super Admin sees all users
    if (userRole === 'SUPER_ADMIN') {
      return this.prisma.user.findMany({
        where,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          branch_id: true,
          is_active: true,
          created_at: true,
        },
      });
    }

    // Non-admin users only see users in their branch
    where.branch_id = userBranchId;

    return this.prisma.user.findMany({
      where,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        branch_id: true,
        is_active: true,
        created_at: true,
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        branch_id: true,
        is_active: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check for email conflict
    if (data.email && data.email !== user.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existing) {
        throw new BadRequestException('Email already exists');
      }
    }

    // Validate branch if being updated
    if (data.branch_id) {
      const branch = await this.prisma.branch.findUnique({
        where: { id: data.branch_id },
      });

      if (!branch) {
        throw new BadRequestException('Branch not found');
      }
    }

    const updateData: any = {
      email: data.email,
      name: data.name,
      phone: data.phone,
      branch_id: data.branch_id,
      updated_at: new Date(),
    };

    // If role is being updated, clear the requires_password_change flag
    if (data.role) {
      updateData.role = data.role;
      updateData.requires_password_change = false;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        branch_id: true,
        is_active: true,
        requires_password_change: true,
        created_at: true,
      },
    });
  }

  async activate(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        is_active: true,
        updated_at: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        branch_id: true,
        is_active: true,
        created_at: true,
      },
    });
  }

  async deactivate(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Soft delete - prevent further access but preserve transaction history
    return this.prisma.user.update({
      where: { id },
      data: {
        is_active: false,
        updated_at: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        branch_id: true,
        is_active: true,
        created_at: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
