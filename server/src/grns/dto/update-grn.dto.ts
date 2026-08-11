import { IsString, IsOptional } from 'class-validator';

export class UpdateGRNDto {
  @IsOptional()
  @IsString()
  notes?: string;
}
