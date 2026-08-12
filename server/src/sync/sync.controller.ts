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
import { SyncService } from './sync.service';
import { SyncOfflineSaleDto } from './dto';

@Controller('sync')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SyncController {
  constructor(private syncService: SyncService) {}

  @Get('data')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER')
  async getAllData(@Query('branchId') branchId: string) {
    return this.syncService.getAllOfflineData(branchId);
  }

  @Post('sales')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'CASHIER')
  async syncOfflineSales(
    @Body() data: SyncOfflineSaleDto,
    @CurrentUser() user: any,
  ) {
    // Validate user has access to the branch
    if (user.role !== 'SUPER_ADMIN' && user.branch_id !== data.branch_id) {
      throw new ForbiddenException('Cannot sync sales from other branches');
    }

    return this.syncService.syncOfflineSales(data);
  }

  @Get('status')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER')
  async getSyncStatus() {
    return this.syncService.getSyncStatus();
  }
}
