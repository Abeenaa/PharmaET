import { IsString, IsEmail, IsPhoneNumber, IsOptional, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsEnum(['SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER'])
  role?: string;

  @IsOptional()
  @IsString()
  branch_id?: string;
}
