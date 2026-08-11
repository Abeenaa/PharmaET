import { IsString, IsNotEmpty, IsUUID, IsArray, ValidateNested, IsPositive, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class POItemDto {
  @IsNotEmpty()
  @IsUUID()
  medicine_id: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity_ordered: number;
}

export class CreatePurchaseOrderDto {
  @IsNotEmpty()
  @IsUUID()
  supplier_id: string;

  @IsNotEmpty()
  @IsUUID()
  branch_id: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => POItemDto)
  items: POItemDto[];
}
