import {
  Controller,
  Get,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('sales')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async getSalesReport(
    @CurrentUser() user: any,
    @Query('branchId') branchId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('medicineId') medicineId?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    // Validate user has access to the branch
    if (user.role !== 'SUPER_ADMIN' && user.branch_id !== branchId) {
      throw new ForbiddenException('Cannot access other branch reports');
    }

    return this.reportsService.generateSalesReport(
      branchId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      medicineId,
      categoryId,
    );
  }

  @Get('inventory')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async getInventoryReport(
    @CurrentUser() user: any,
    @Query('branchId') branchId: string,
    @Query('medicineId') medicineId?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    // Validate user has access to the branch
    if (user.role !== 'SUPER_ADMIN' && user.branch_id !== branchId) {
      throw new ForbiddenException('Cannot access other branch reports');
    }

    return this.reportsService.generateInventoryReport(
      branchId,
      medicineId,
      categoryId,
    );
  }
}
