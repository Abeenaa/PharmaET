import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: DatabaseService) {}

  async create(data: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        is_active: true,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      where: { is_active: true },
      include: {
        _count: {
          select: { medicines: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { medicines: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, data: UpdateCategoryDto) {
    const category = await this.findById(id);

    return this.prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        updated_at: new Date(),
      },
    });
  }

  async deactivate(id: string) {
    const category = await this.findById(id);

    return this.prisma.category.update({
      where: { id },
      data: {
        is_active: false,
        updated_at: new Date(),
      },
    });
  }
}
