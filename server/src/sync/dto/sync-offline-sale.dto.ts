import { IsString, IsNotEmpty, IsUUID, IsArray, ValidateNested, IsPositive, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class SyncSaleItemDto {
  @IsNotEmpty()
  @IsUUID()
  medicine_id: string;

  @IsNotEmpty()
  @IsUUID()
  batch_id: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  unit_price: number;
}

export class SyncOfflineSaleDto {
  @IsNotEmpty()
  @IsString()
  transaction_id: string;

  @IsNotEmpty()
  @IsUUID()
  branch_id: string;

  @IsNotEmpty()
  @IsUUID()
  cashier_id: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  total_amount: number;

  @IsNotEmpty()
  @IsDateString()
  created_at: Date;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncSaleItemDto)
  items: SyncSaleItemDto[];
}
