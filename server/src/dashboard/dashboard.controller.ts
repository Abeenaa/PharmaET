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
    // Use user's branch if not provided or if non-admin, validate access
    const targetBranchId = branchId || user.branch_id;
    
    if (!targetBranchId) {
      throw new ForbiddenException('Branch ID is required');
    }

    // Validate user has access to the branch
    if (user.role !== 'SUPER_ADMIN' && user.branch_id !== targetBranchId) {
      throw new ForbiddenException('Cannot access other branch dashboard');
    }

    return this.dashboardService.getSummary(
      targetBranchId,
      date ? new Date(date) : undefined,
    );
  }

  @Get('inventory')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async getInventoryStatus(
    @CurrentUser() user: any,
    @Query('branchId') branchId: string,
  ) {
    // Use user's branch if not provided or if non-admin, validate access
    const targetBranchId = branchId || user.branch_id;
    
    if (!targetBranchId) {
      throw new ForbiddenException('Branch ID is required');
    }

    // Validate user has access to the branch
    if (user.role !== 'SUPER_ADMIN' && user.branch_id !== targetBranchId) {
      throw new ForbiddenException('Cannot access other branch dashboard');
    }

    return this.dashboardService.getInventoryStatus(targetBranchId);
  }

  @Get('alerts')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async getAlerts(
    @CurrentUser() user: any,
    @Query('branchId') branchId: string,
  ) {
    // Use user's branch if not provided or if non-admin, validate access
    const targetBranchId = branchId || user.branch_id;
    
    if (!targetBranchId) {
      throw new ForbiddenException('Branch ID is required');
    }

    // Validate user has access to the branch
    if (user.role !== 'SUPER_ADMIN' && user.branch_id !== targetBranchId) {
      throw new ForbiddenException('Cannot access other branch alerts');
    }

    return this.dashboardService.getAlerts(targetBranchId);
  }
}
