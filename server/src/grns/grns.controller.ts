import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GRNsService } from './grns.service';
import { CreateGRNDto, AddGRNItemDto } from './dto';

@Controller('grns')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GRNsController {
  constructor(private grnsService: GRNsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async create(
    @Body() dto: CreateGRNDto,
    @CurrentUser() user: any,
  ) {
    return this.grnsService.create(dto, user.id, user);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async findAll(
    @CurrentUser() user: any,
    @Query('branchId') branchId?: string,
  ) {
    // Validate branch access
    if (branchId && user.role !== 'SUPER_ADMIN' && user.branch_id !== branchId) {
      throw new ForbiddenException('Cannot access other branch GRNs');
    }

    const queryBranchId = branchId || (user.role === 'SUPER_ADMIN' ? undefined : user.branch_id);
    return this.grnsService.findAll(queryBranchId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async findById(@Param('id') id: string) {
    return this.grnsService.findById(id);
  }

  @Post(':grnId/items')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async addItem(
    @Param('grnId') grnId: string,
    @Body() dto: AddGRNItemDto,
  ) {
    return this.grnsService.addItem(grnId, dto.po_item_id, dto);
  }

  @Post(':id/finalize')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async finalize(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.grnsService.finalize(id, user);
  }
}
