import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';

@Module({
  imports: [DatabaseModule],
  providers: [SuppliersService],
  controllers: [SuppliersController],
  exports: [SuppliersService],
})
export class SuppliersModule {}
