import { Module } from '@nestjs/common';
import { GRNsService } from './grns.service';
import { GRNsController } from './grns.controller';

@Module({
  providers: [GRNsService],
  controllers: [GRNsController],
  exports: [GRNsService],
})
export class GRNsModule {}
