import { Module } from '@nestjs/common';
import { StockAdjustmentsService } from './stock-adjustments.service';
import { StockAdjustmentsController } from './stock-adjustments.controller';

@Module({
  providers: [StockAdjustmentsService],
  controllers: [StockAdjustmentsController],
  exports: [StockAdjustmentsService],
})
export class StockAdjustmentsModule {}
