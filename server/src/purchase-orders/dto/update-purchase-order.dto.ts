import { IsString, IsOptional, IsUUID, IsArray, ValidateNested, IsPositive, IsNumber, IsNotEmpty } from 'class-validator';
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

export class UpdatePurchaseOrderDto {
  @IsOptional()
  @IsUUID()
  supplier_id?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => POItemDto)
  items?: POItemDto[];
}
