import {
  IsNotEmpty,
  Length,
  IsUrl,
} from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  @Length(1, 250)
  name: string;
  
  @IsNotEmpty()
  @IsUrl()
  link: string;
  
  @IsNotEmpty()
  @IsUrl()
  image: string;
  
  price: number;
  
  @IsNotEmpty()
  @Length(1, 1024)
  description: string;
}