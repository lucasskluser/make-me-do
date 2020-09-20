import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ errorHttpStatusCode: 422 }));  
  await app.listen(3000);
}

bootstrap();
