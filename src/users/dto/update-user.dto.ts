import { IsEmail, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @Length(2, 30)
  @IsOptional()
  username: string;

  @Length(2, 200)
  @IsOptional()
  about: string;

  @IsOptional()
  avatar: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  password: string;
}
