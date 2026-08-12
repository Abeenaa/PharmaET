import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN')
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: any,
  ) {
    // BRANCH_ADMIN can only create users in their own branch
    if (user.role === 'BRANCH_ADMIN' && user.branch_id !== dto.branch_id) {
      throw new ForbiddenException('Can only create users in your own branch');
    }

    return this.usersService.create(dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN')
  async findAll(@CurrentUser() user: any) {
    return this.usersService.findAll(user.id, user.branch_id, user.role);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    // Retrieve user and validate branch access
    const targetUser = await this.usersService.findById(id);
    if (user.role === 'BRANCH_ADMIN' && user.branch_id !== targetUser.branch_id) {
      throw new ForbiddenException('Can only update users in your own branch');
    }

    return this.usersService.update(id, dto);
  }

  @Post(':id/activate')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN')
  async activate(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    // Retrieve user and validate branch access
    const targetUser = await this.usersService.findById(id);
    if (user.role === 'BRANCH_ADMIN' && user.branch_id !== targetUser.branch_id) {
      throw new ForbiddenException('Can only activate users in your own branch');
    }

    return this.usersService.activate(id);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'BRANCH_ADMIN')
  async deactivate(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    // Retrieve user and validate branch access
    const targetUser = await this.usersService.findById(id);
    if (user.role === 'BRANCH_ADMIN' && user.branch_id !== targetUser.branch_id) {
      throw new ForbiddenException('Can only deactivate users in your own branch');
    }

    return this.usersService.deactivate(id);
  }
}
