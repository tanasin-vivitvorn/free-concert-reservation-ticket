import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Concert } from '../concerts/concert.entity';
import { Reservation } from '../reservations/reservation.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Concert, Reservation]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class DatabaseModule {} 