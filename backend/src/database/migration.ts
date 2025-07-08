import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SeederModule } from './seeder.module';
import { getRepository } from 'typeorm';
import { Concert } from '../concerts/concert.entity';

async function bootstrap() {
  try {
    const appContext = await NestFactory.createApplicationContext(SeederModule);
    const logger = appContext.get(Logger);

    logger.log('Starting database migration...');

    const concertRepo = getRepository(Concert);

    const concerts = await concertRepo.find();

    for (const concert of concerts) {
      if (concert.remain_seat === undefined || concert.remain_seat === null) {
        concert.remain_seat = concert.seat;
        await concertRepo.save(concert);
        logger.log(
          `Updated concert ${concert.name}: remain_seat = ${concert.seat}`,
        );
      }
    }

    logger.log('Database migration completed!');
    await appContext.close();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

bootstrap();
