import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';

@Module({
  imports: [DatabaseModule],
  providers: [SalesService],
  controllers: [SalesController],
  exports: [SalesService],
})
export class SalesModule {}
