import { IsString, IsNotEmpty, IsNumber, IsPositive, IsDateString } from 'class-validator';

export class AddGRNItemDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity_received: number;

  @IsNotEmpty()
  @IsString()
  batch_number: string;

  @IsNotEmpty()
  @IsDateString()
  expiry_date: Date;
}
