import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from './dto';

@Controller('purchase-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PurchaseOrdersController {
  constructor(private purchaseOrdersService: PurchaseOrdersService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async create(
    @Body() dto: CreatePurchaseOrderDto,
    @CurrentUser() user: any,
  ) {
    if (!user || !user.id) {
      throw new BadRequestException('User information is missing from authentication token');
    }
    return this.purchaseOrdersService.create(dto, user.id);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async findAll(
    @CurrentUser() user: any,
    @Query('branchId') branchId?: string,
  ) {
    // Validate branch access
    if (branchId && user.role !== 'SUPER_ADMIN' && user.branch_id !== branchId) {
      throw new ForbiddenException('Cannot access other branch POs');
    }

    // Default to user's branch if not super admin
    const queryBranchId = branchId || (user.role === 'SUPER_ADMIN' ? undefined : user.branch_id);
    
    return this.purchaseOrdersService.findAll(queryBranchId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async findById(@Param('id') id: string) {
    return this.purchaseOrdersService.findById(id);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePurchaseOrderDto,
    @CurrentUser() user: any,
  ) {
    // Retrieve PO and validate user has access to this branch
    const po = await this.purchaseOrdersService.findById(id);
    if (user.role !== 'SUPER_ADMIN' && user.branch_id !== po.branch_id) {
      throw new ForbiddenException('Cannot update PO from other branches');
    }

    return this.purchaseOrdersService.update(id, dto);
  }

  @Post(':id/submit')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async submit(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    // Retrieve PO and validate user has access to this branch
    const po = await this.purchaseOrdersService.findById(id);
    if (user.role !== 'SUPER_ADMIN' && user.branch_id !== po.branch_id) {
      throw new ForbiddenException('Cannot submit PO from other branches');
    }

    return this.purchaseOrdersService.submit(id);
  }

  @Post(':id/cancel')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN')
  async cancel(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    // Retrieve PO and validate user has access to this branch
    const po = await this.purchaseOrdersService.findById(id);
    if (user.role !== 'SUPER_ADMIN' && user.branch_id !== po.branch_id) {
      throw new ForbiddenException('Cannot cancel PO from other branches');
    }

    return this.purchaseOrdersService.cancel(id);
  }
}
