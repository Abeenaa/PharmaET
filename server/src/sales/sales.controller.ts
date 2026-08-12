import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SalesService } from './sales.service';
import { CreateSaleDto, POSSearchDto } from './dto';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'CASHIER')
  async createSale(
    @Body() dto: CreateSaleDto,
    @CurrentUser() user: any,
  ) {
    // Validate user has access to the branch
    if (user.role !== 'SUPER_ADMIN' && user.branch_id !== dto.branch_id) {
      throw new ForbiddenException('Cannot create sales for other branches');
    }

    return this.salesService.createSale(dto, user.id);
  }

  @Get('history')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async findHistory(
    @CurrentUser() user: any,
    @Query('branchId') branchId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    // If not super admin, restrict to their branch
    const queryBranchId = branchId || (user.role === 'SUPER_ADMIN' ? undefined : user.branch_id);

    return this.salesService.findHistory(
      queryBranchId,
      limit ? parseInt(limit) : 50,
      offset ? parseInt(offset) : 0,
    );
  }

  @Get('pos/search')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'CASHIER')
  async posSearch(
    @Query('search') search: string,
    @Query('branchId') branchId: string,
    @CurrentUser() user: any,
  ) {
    if (!search || search.length < 1) {
      throw new BadRequestException('Search term required');
    }

    // Validate user has access to the branch
    if (user.role !== 'SUPER_ADMIN' && user.branch_id !== branchId) {
      throw new ForbiddenException('Cannot search medicines from other branches');
    }

    return this.salesService.getPOSMedicineSearch(search, branchId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'CASHIER', 'PHARMACIST')
  async findById(@Param('id') id: string) {
    return this.salesService.findById(id);
  }
}
