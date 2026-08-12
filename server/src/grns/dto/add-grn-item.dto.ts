import { IsString, IsNotEmpty, IsNumber, IsPositive, IsDateString, IsUUID } from 'class-validator';

export class AddGRNItemDto {
  @IsNotEmpty()
  @IsUUID()
  po_item_id: string;

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
