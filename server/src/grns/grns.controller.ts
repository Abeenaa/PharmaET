import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
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
    return this.grnsService.create(dto, user.id);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async findAll(@Query('branchId') branchId?: string) {
    return this.grnsService.findAll(branchId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async findById(@Param('id') id: string) {
    return this.grnsService.findById(id);
  }

  @Post(':id/items')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async addItem(
    @Param('id') grnId: string,
    @Param('poItemId') poItemId: string,
    @Body() dto: AddGRNItemDto,
  ) {
    return this.grnsService.addItem(grnId, poItemId, dto);
  }

  @Post(':id/finalize')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST')
  async finalize(@Param('id') id: string) {
    return this.grnsService.finalize(id);
  }
}
