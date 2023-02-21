import { IsNotEmpty } from "class-validator";

export class FindUserDto {
  @IsNotEmpty()
  query: string; // На вход API-методу передаётся строка, которая может быть как именем пользователя, так и его почтой.
}