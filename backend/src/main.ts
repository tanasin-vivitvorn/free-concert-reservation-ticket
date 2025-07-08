import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { environmentConfig } from './config';

async function bootstrap() {
  console.log('Starting Free Concert Ticket Booking API...');

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Free Concert Ticket Booking API')
    .setDescription('API documentation for Free Concert Ticket Booking')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = environmentConfig.app.port;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API documentation available at: http://localhost:${port}/api`);
}
bootstrap();
