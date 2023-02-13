import { IsUrl, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  @Column()
  @Length(1, 1500)
  description: string;

  //image — обложка для подборки;
  @Column()
  @IsUrl()
  image: string;

  //owner - привязка к владельцу
  @ManyToOne(() => User, (user) => user.id)
  owner: User;
}
