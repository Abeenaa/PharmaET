import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('unread-count/:branchId')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER')
  async getUnreadCount(@Param('branchId') branchId: string) {
    return {
      count: await this.notificationsService.getUnreadCount(branchId),
    };
  }

  @Get('low-stock/:branchId')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async getLowStockAlerts(@Param('branchId') branchId: string) {
    return this.notificationsService.getActiveLowStockAlerts(branchId);
  }

  @Get('expiring/:branchId')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async getExpiringAlerts(@Param('branchId') branchId: string) {
    return this.notificationsService.getExpiringBatchAlerts(branchId);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER')
  async findAll(
    @Query('branchId') branchId?: string,
    @Query('isRead') isRead?: string,
  ) {
    return this.notificationsService.findAll(
      branchId,
      isRead ? isRead === 'true' : undefined,
    );
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER')
  async findById(@Param('id') id: string) {
    return this.notificationsService.findById(id);
  }

  @Put(':id/read')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER')
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Put('mark-all-read/:branchId')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async markAllAsRead(
    @Param('branchId') branchId: string,
    @CurrentUser() user: any,
  ) {
    return this.notificationsService.markAllAsRead(branchId, user.id);
  }
}
