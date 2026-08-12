import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { GRNsService } from './grns.service';
import { GRNsController } from './grns.controller';

@Module({
  imports: [DatabaseModule],
  providers: [GRNsService],
  controllers: [GRNsController],
  exports: [GRNsService],
})
export class GRNsModule {}
