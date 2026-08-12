import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  ForbiddenException,
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
    // Validate user has access to the branch
    if (user.role !== 'SUPER_ADMIN' && user.branch_id !== dto.branch_id) {
      throw new ForbiddenException('Cannot adjust stock in other branches');
    }

    return this.stockAdjustmentsService.create(dto, user.id);
  }

  @Get('history')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async findHistory(
    @CurrentUser() user: any,
    @Query('medicineId') medicineId?: string,
    @Query('branchId') branchId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    // If not super admin, restrict to their branch
    const queryBranchId = branchId || (user.role === 'SUPER_ADMIN' ? undefined : user.branch_id);

    return this.stockAdjustmentsService.findHistory(
      medicineId,
      queryBranchId,
      limit ? parseInt(limit) : 50,
      offset ? parseInt(offset) : 0,
    );
  }
}
