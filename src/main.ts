import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);  
	app.enableCors();
	app.useGlobalPipes(new ValidationPipe());
	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
	await app.listen(3001);
}
bootstrap();