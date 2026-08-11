import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CategoriesService } from './categories.service';
import { MedicinesService } from './medicines.service';
import { BatchesService } from './batches.service';
import { CategoriesController } from './medicines.controller';
import { MedicinesController } from './medicines.controller';
import { BatchesController } from './batches.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController, MedicinesController, BatchesController],
  providers: [CategoriesService, MedicinesService, BatchesService],
  exports: [CategoriesService, MedicinesService, BatchesService],
})
export class MedicinesModule {}
