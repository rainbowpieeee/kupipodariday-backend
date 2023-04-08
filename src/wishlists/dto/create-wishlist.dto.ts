import { 
  IsOptional, 
  Length, 
  IsUrl 
} from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  name: string;
  
  @IsUrl()
  image: string;
  
  @IsOptional()
  public itemsId: number[];
  }