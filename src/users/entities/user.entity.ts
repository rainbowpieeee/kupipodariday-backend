import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { 
  Length, 
  IsEmail, 
  IsString, 
  IsNotEmpty, 
  IsUrl } from 'class-validator';
import { BaseEntity } from 'src/general/baseEntity';
import { Wish } from './../../wishes/entities/wish.entity';
import { Offer } from './../../offers/entities/offer.entity';
import { Wishlist } from './../../wishlists/entities/wishlist.entity';

@Entity()
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    unique: true,
  })
  @Length(2, 30)
  @IsString()
  @IsNotEmpty()
  username: string;

  @Column({
    type: 'varchar',
    default: 'Пока ничего не рассказал о себе',
  })
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({
    type: 'varchar',
    default: 'https://i.pravatar.cc/300',
  })
  @IsString()
  @IsUrl()
  avatar: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column({
    type: 'varchar',
    select: false,
  })
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
