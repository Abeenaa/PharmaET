import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateMedicineDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  generic_name: string;

  @IsOptional()
  @IsString()
  strength?: string;

  @IsOptional()
  @IsString()
  form?: string;

  @IsNotEmpty()
  @IsString()
  barcode: string;

  @IsNotEmpty()
  @IsUUID()
  category_id: string;
}
