import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());  
  app.use(csurf({ cookie: true }));
  app.enableCors({
  origin: ['http://localhost:3000', 'https://agreeable-field-0cf67e610.2.azurestaticapps.net'],
  credentials: true,
  });
  const port = process.env.PORT || 1433;
  console.log(`App is starting on port ${port}`);
  await app.listen(port);
}
bootstrap();
