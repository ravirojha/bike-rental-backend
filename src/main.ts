import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = String(process.env.PORT);
  app.enableCors();
  await app.listen(5000, () => {
  });
}
bootstrap();


//  await app.listen(PORT || 5000, () => {