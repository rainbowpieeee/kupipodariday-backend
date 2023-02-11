import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'student',
      password: '152637',
      database: 'kupipodariday',
      entities: [],
      synchronize: true,
    }),
	UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
  ],
  controllers: [AppController],
  providers: [],
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
