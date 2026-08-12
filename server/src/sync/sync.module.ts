import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';

@Module({
  imports: [DatabaseModule],
  providers: [SyncService],
  controllers: [SyncController],
  exports: [SyncService],
})
export class SyncModule {}
