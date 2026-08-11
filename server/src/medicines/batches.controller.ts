import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto';

@Controller('medicines/:medicineId/batches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BatchesController {
  constructor(private batchesService: BatchesService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async create(@Param('medicineId') medicineId: string, @Body() dto: CreateBatchDto) {
    return this.batchesService.create(medicineId, dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER')
  async findByMedicineId(@Param('medicineId') medicineId: string) {
    return this.batchesService.findByMedicineId(medicineId);
  }

  @Get(':batchId')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER')
  async findById(@Param('batchId') batchId: string) {
    return this.batchesService.findById(batchId);
  }

  @Get('active/fefo')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER')
  async getFEFOBatch(@Param('medicineId') medicineId: string) {
    return this.batchesService.getFEFOBatch(medicineId);
  }
}
