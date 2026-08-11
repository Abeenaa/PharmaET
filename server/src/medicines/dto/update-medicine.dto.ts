import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateMedicineDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  generic_name?: string;

  @IsOptional()
  @IsString()
  strength?: string;

  @IsOptional()
  @IsString()
  form?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;
}
