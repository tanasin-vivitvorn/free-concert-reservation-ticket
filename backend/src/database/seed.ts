import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  try {
    const appContext = await NestFactory.createApplicationContext(SeederModule);
    const logger = appContext.get(Logger);
    const seeder = appContext.get(SeederService);
    logger.log('Starting database seeding...');
    await seeder.seed();
    logger.log('Database seeding completed successfully!');
    await appContext.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

bootstrap();