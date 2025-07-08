import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Concert } from '../concerts/concert.entity';
import { Reservation } from '../reservations/reservation.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'concertdb',
      autoLoadEntities: true,
      synchronize: true,
      retryAttempts: 20,
      retryDelay: 5000,
      verboseRetryLog: true,
    }),
    TypeOrmModule.forFeature([User, Concert, Reservation]),
  ],
  providers: [SeederService, Logger],
})
export class SeederModule {} 