import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrdersController } from './purchase-orders.controller';

@Module({
  imports: [DatabaseModule],
  providers: [PurchaseOrdersService],
  controllers: [PurchaseOrdersController],
  exports: [PurchaseOrdersService],
})
export class PurchaseOrdersModule {}
