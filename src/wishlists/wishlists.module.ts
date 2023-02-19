import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { UsersModule } from 'src/users/users.module';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
	imports: [
	  TypeOrmModule.forFeature([Wishlist]),
	  UsersModule,
	  WishesModule
	],
	controllers: [WishlistsController],
	providers: [WishlistsService],
	exports: [WishlistsService]
  })
  export class WishlistsModule {}