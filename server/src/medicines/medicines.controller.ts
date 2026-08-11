import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CategoriesService } from './categories.service';
import { MedicinesService } from './medicines.service';
import { CreateCategoryDto, UpdateCategoryDto, CreateMedicineDto, UpdateMedicineDto } from './dto';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER')
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER')
  async findById(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN')
  async deactivate(@Param('id') id: string) {
    return this.categoriesService.deactivate(id);
  }
}

@Controller('medicines')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicinesController {
  constructor(private medicinesService: MedicinesService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async create(@Body() dto: CreateMedicineDto) {
    return this.medicinesService.create(dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER')
  async findAll(@Query('search') search?: string) {
    return this.medicinesService.findAll(search);
  }

  @Get('barcode/:barcode')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER')
  async findByBarcode(@Param('barcode') barcode: string) {
    return this.medicinesService.findByBarcode(barcode);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER')
  async findById(@Param('id') id: string) {
    return this.medicinesService.findById(id);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async update(@Param('id') id: string, @Body() dto: UpdateMedicineDto) {
    return this.medicinesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN')
  async deactivate(@Param('id') id: string) {
    return this.medicinesService.deactivate(id);
  }
}
