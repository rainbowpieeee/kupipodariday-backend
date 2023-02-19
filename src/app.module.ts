import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { Offer } from './offers/entities/offer.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/config';
import { EmailModule } from './email-sender/email-sender.module';

import dotenv = require('dotenv');
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'student',
      password: '152637',
      database: 'kupipodariday',
      entities: [User, Wish, Wishlist, Offer],
      synchronize: true,
    }),
	WinstonModule.forRoot({
		levels: {
		  critical_error: 0,
		  error: 1,
		  special_warning: 2,
		  another_log_level: 3,
		  info: 4,
		},
		transports: [
		  new winston.transports.Console({ format: winston.format.simple() }),
		  new winston.transports.File({ filename: 'error.log', level: 'error' }),
		],
	}),    
	UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
	AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// означает, что при старте приложение будет подгонять базу в СУБД к той,
// что описана в ORM.
// Удобно для разработки, но точно не стоит использовать в продакшене,
// поскольку может привести к неочевидным изменениям и конфликтам
// при работе нескольких разработчиков.
// Изменения продакшен-базы должны происходить явным образом — это мы разберём
// в теме про миграции.
/* entities — сущности, которые описывают нашу базу данных. Пока их нет, мы ничего не можем делать с базой, добавим их в следующем уроке.
.*/

/*
    ConfigModule.forRoot({
      load: [configuration]      
    }),
*/