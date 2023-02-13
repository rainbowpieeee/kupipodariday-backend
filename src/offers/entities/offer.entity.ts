import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //user содержит id желающего скинуться;
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  //item содержит ссылку на товар;
  @ManyToOne(() => Wish, (wish) => wish.id)
  item: Wish;

  //amount — сумма заявки, округляется до двух знаков после запятой;
  @Column()
  amount: number;

  //hidden — флаг, который определяет показывать ли информацию о скидывающемся в списке. По умолчанию равен false.
  @Column({
    default: false,
  })
  hidden: boolean;
}
