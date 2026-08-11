import { IsString, IsNotEmpty, IsNumber, IsPositive, IsDateString } from 'class-validator';

export class CreateBatchDto {
  @IsNotEmpty()
  @IsString()
  batch_number: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsDateString()
  expiry_date: Date;
}
