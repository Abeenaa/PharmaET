import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BranchesModule } from './branches/branches.module';
import { MedicinesModule } from './medicines/medicines.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { GrnsModule } from './grns/grns.module';
import { SalesModule } from './sales/sales.module';
import { StockAdjustmentsModule } from './stock-adjustments/stock-adjustments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SyncModule } from './sync/sync.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BranchesModule,
    MedicinesModule,
    SuppliersModule,
    PurchaseOrdersModule,
    GrnsModule,
    SalesModule,
    StockAdjustmentsModule,
    DashboardModule,
    ReportsModule,
    NotificationsModule,
    SyncModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
