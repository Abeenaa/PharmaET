import { IsString, IsNotEmpty, IsUUID, IsNumber, IsEnum } from 'class-validator';

enum AdjustmentReason {
  DAMAGE = 'DAMAGE',
  LOSS = 'LOSS',
  EXPIRED = 'EXPIRED',
  CORRECTION = 'CORRECTION',
}

export class CreateStockAdjustmentDto {
  @IsNotEmpty()
  @IsUUID()
  medicine_id: string;

  @IsNotEmpty()
  @IsUUID()
  branch_id: string;

  @IsNotEmpty()
  @IsEnum(AdjustmentReason)
  reason: AdjustmentReason;

  @IsNotEmpty()
  @IsNumber()
  quantity_change: number;
}
