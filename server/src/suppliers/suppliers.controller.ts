import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto';

@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN')
  async create(@Body() dto: CreateSupplierDto) {
    return this.suppliersService.create(dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async findAll() {
    return this.suppliersService.findAll();
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async findById(@Param('id') id: string) {
    return this.suppliersService.findById(id);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN')
  async update(@Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    return this.suppliersService.update(id, dto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN')
  async deactivate(@Param('id') id: string) {
    return this.suppliersService.deactivate(id);
  }
}
