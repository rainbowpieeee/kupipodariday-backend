import { IsNotEmpty, Length } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  // about — **информация о пользователе, строка от 2 до 200 символов.
  // В качестве значения по умолчанию укажите для него строку: «Пока ничего не рассказал о себе».
  @Column({
    default: 'Пока ничего не рассказал о себе',
  })
  @Length(2, 200)
  about: string;

  // avatar — ссылка на аватар. В качестве значения по умолчанию задайте https://i.pravatar.cc/300
  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string;

  // email — адрес электронной почты пользователя, должен быть уникален.
  @Column({
    unique: true,
  })
  email: string;

  // password — пароль пользователя, строка.
  @Column()
  password: string;

  // wishes — список желаемых подарков. Используйте для него соответствующий тип связи.
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  // offers — содержит список подарков, на которые скидывается пользователь. Установите для него подходящий тип связи.
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  // wishlists содержит список вишлистов, которые создал пользователь. Установите для него подходящий тип связи.
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}

/*
@PrimaryGeneratedColumn ()
частный случай декоратора столбца, означающий,
что он будет первичным сгенерированным ключом.
То есть, возрастающим идентификатором (например, “1,2,3....”).
Во всех БД такие поля немного по разному реализованы, и удобно, что ORM позволяет спрятать эти различия под капотом.
*/