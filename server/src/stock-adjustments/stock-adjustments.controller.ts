import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { StockAdjustmentsService } from './stock-adjustments.service';
import { CreateStockAdjustmentDto } from './dto';

@Controller('stock')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockAdjustmentsController {
  constructor(private stockAdjustmentsService: StockAdjustmentsService) {}

  @Post('adjust')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async create(
    @Body() dto: CreateStockAdjustmentDto,
    @CurrentUser() user: any,
  ) {
    return this.stockAdjustmentsService.create(dto, user.id);
  }

  @Get('history')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async findHistory(
    @Query('medicineId') medicineId?: string,
    @Query('branchId') branchId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.stockAdjustmentsService.findHistory(
      medicineId,
      branchId,
      limit ? parseInt(limit) : 50,
      offset ? parseInt(offset) : 0,
    );
  }
}
