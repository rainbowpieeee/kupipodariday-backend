import { IsNotEmpty, IsOptional, IsUrl, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// @Entity() — декоратор обозначает, что мы описываем модель и на основании этой модели нужно создать таблицу

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //name — название списка. Не может быть длиннее 250 символов и короче одного;
  @Column()
  @Length(1, 250)
  name: string;

  //description — описание подборки, строка до 1500 символов;
  @Column({ nullable: true })
  @Length(1, 1500)
  description: string;

  //image — обложка для подборки;
  @Column({ default: 'https://i.pravatar.cc/' })
  @IsUrl()
  @IsOptional()
  image: string;

  //owner - привязка к владельцу
  @ManyToOne(() => User, (user) => user.wishlists)
  @IsNotEmpty()
  owner: User;

  //items -  желания
  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[]
}
