import { IsString, IsEmail, IsPhoneNumber, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsNotEmpty()
  @IsEnum(['SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER'])
  role: string;

  @IsOptional()
  @IsString()
  branch_id?: string;
}
