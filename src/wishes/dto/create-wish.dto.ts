import { IsInt, IsNotEmpty, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @Length(1, 1240)
  description: string;

  @IsInt()
  raised: number;
}
