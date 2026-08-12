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
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('summary')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async getSummary(
    @CurrentUser() user: any,
    @Query('branchId') branchId: string,
    @Query('date') date?: string,
  ) {
    // Validate user has access to the branch
    if (user.role !== 'SUPER_ADMIN' && user.branch_id !== branchId) {
      throw new ForbiddenException('Cannot access other branch dashboard');
    }

    return this.dashboardService.getSummary(
      branchId,
      date ? new Date(date) : undefined,
    );
  }

  @Get('inventory')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async getInventoryStatus(
    @CurrentUser() user: any,
    @Query('branchId') branchId: string,
  ) {
    // Validate user has access to the branch
    if (user.role !== 'SUPER_ADMIN' && user.branch_id !== branchId) {
      throw new ForbiddenException('Cannot access other branch dashboard');
    }

    return this.dashboardService.getInventoryStatus(branchId);
  }

  @Get('alerts')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async getAlerts(
    @CurrentUser() user: any,
    @Query('branchId') branchId: string,
  ) {
    // Validate user has access to the branch
    if (user.role !== 'SUPER_ADMIN' && user.branch_id !== branchId) {
      throw new ForbiddenException('Cannot access other branch alerts');
    }

    return this.dashboardService.getAlerts(branchId);
  }
}
