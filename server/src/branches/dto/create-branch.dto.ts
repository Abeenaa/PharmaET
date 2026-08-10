import { IsString, IsEmail, IsPhoneNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBranchDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  license_number: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsPhoneNumber()
  contact_phone?: string;

  @IsOptional()
  @IsEmail()
  contact_email?: string;
}
