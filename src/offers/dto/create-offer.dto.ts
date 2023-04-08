import { IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
