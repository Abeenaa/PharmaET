import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { StockAdjustmentsService } from './stock-adjustments.service';
import { StockAdjustmentsController } from './stock-adjustments.controller';

@Module({
  imports: [DatabaseModule],
  providers: [StockAdjustmentsService],
  controllers: [StockAdjustmentsController],
  exports: [StockAdjustmentsService],
})
export class StockAdjustmentsModule {}
