import { 
  IsEmail, 
  IsString, 
  Length, 
  IsOptional 
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 30)
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsString()
  @Length(2, 200)
  @IsOptional()
  about: string;

  @IsString()
  @IsOptional()
  avatar: string;
}
