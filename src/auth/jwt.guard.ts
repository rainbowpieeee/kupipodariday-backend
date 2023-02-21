import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}

/*
Добавляем проверку аутентификации
Чтобы проверить, аутентифицирован ли пользователь, пакет @nestjs/passport предоставляет гарду AuthGuard.
На основе этой гарды мы можем сделать свою, достаточно лишь указать имя стратегии:
*/
