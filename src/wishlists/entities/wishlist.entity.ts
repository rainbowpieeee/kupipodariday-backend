import { IsUrl } from 'class-validator';
import { BaseEntity } from 'src/general/baseEntity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { 
  Entity, 
  Column, 
  ManyToOne, 
  ManyToMany, 
  JoinTable 
} from 'typeorm';

@Entity()
export class Wishlist extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 250,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 1500,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
  })
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
