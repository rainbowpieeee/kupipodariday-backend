import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @Length(2, 200)
  @IsOptional()
  about: string;

  @IsOptional()
  avatar: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}