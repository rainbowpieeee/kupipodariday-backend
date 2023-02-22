import { OmitType } from "@nestjs/mapped-types";
import { IsInt } from "class-validator";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "./create-user.dto";

export class PublicUserDto extends OmitType(CreateUserDto, ['email', 'password']) {

  @IsInt()
  id: number;

  static getFromUser(user: User): PublicUserDto {
    return {    
      id: user.id,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
    }
  }
}

// The OmitType() function constructs a type by picking all properties from an input type and then removing a particular set of keys.