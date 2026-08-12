import { IsString, IsNotEmpty } from 'class-validator';

export class POSSearchDto {
  @IsNotEmpty()
  @IsString()
  search: string;
}
