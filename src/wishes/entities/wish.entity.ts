import { IsInt, IsUrl, Length } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // name — название подарка. Не может быть длиннее 250 символов и короче одного.
  @Column()
  @Length(1, 250)
  name: string;

  // link — ссылка на интернет-магазин, в котором можно приобрести подарок, строка.
  @Column()
  @IsUrl()
  link: string;

  // image - ссылка на изображение подарка, строка. Должна быть валидным URL.
  @Column()
  @IsUrl()
  image: string;

  // price — стоимость подарка, с округлением до сотых, число.
  @Column()
  @IsInt()
  price: number;

  // raised — сумма предварительного сбора или сумма, которую пользователи сейчас готовы скинуть на подарок. Также округляется до сотых.
  @Column({ nullable: true })
  @IsInt()
  raised: number;

  // owner — ссылка на пользователя, который добавил пожелание подарка.
  @ManyToOne(() => User, (user) => user.id)
  owner: User;

  // description — строка с описанием подарка длиной от 1 и до 1024 символов.
  @Column()
  @Length(1, 1240)
  description: string;

  // offers — массив ссылок на заявки скинуться от других пользователей.
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  // copied — содержит cчётчик тех, кто скопировал подарок себе. Целое десятичное число.
  @Column({
    default: 0,
  })
  @IsInt()
  copied: number;
}
