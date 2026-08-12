import { IsString, IsNotEmpty, IsUUID, IsArray, ValidateNested, IsPositive, IsNumber, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

class SaleItemDto {
  @IsNotEmpty()
  @IsUUID()
  medicine_id: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  unit_price: number;
}

export class CreateSaleDto {
  @IsNotEmpty()
  @IsUUID()
  branch_id: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];
}
