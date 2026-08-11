import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateGRNDto {
  @IsNotEmpty()
  @IsUUID()
  po_id: string;
}
