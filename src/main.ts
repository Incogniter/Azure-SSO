import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());  
  app.use(csurf({ cookie: true }));
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 1433);
}
bootstrap();
