import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './reservation.entity';
import { Concert } from '../concerts/concert.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    @InjectRepository(Concert)
    private readonly concertRepo: Repository<Concert>,
  ) {}

  async reserve(dto: CreateReservationDto): Promise<Reservation> {
    
    const concert = await this.concertRepo.findOneBy({ id: dto.concertId });
    if (!concert) {
      throw new NotFoundException('Concert not found');
    }

    if (concert.date < new Date()) {
      throw new BadRequestException('Cannot reserve past concerts');
    }

    const existingReservation = await this.reservationRepo.findOneBy({
      userId: dto.userId,
      concertId: dto.concertId,
      canceled: false,
    });
    if (existingReservation) {
      throw new BadRequestException('User already reserved this concert');
    }

    if (concert.remain_seat <= 0) {
      throw new BadRequestException('No seats available');
    }

    concert.remain_seat -= 1;
    await this.concertRepo.save(concert);

    const reservation = this.reservationRepo.create({
      ...dto,
      datetime: dto.datetime ? new Date(dto.datetime) : new Date(),
    });
    return this.reservationRepo.save(reservation);
  }

  async cancel(userId: number, concertId: number): Promise<Reservation> {
    const reservation = await this.reservationRepo.findOneBy({
      userId,
      concertId,
      canceled: false,
    });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    const concert = await this.concertRepo.findOneBy({ id: concertId });
    if (concert && concert.date < new Date()) {
      throw new BadRequestException('Cannot cancel past concerts');
    }

    if (concert) {
      concert.remain_seat += 1;
      await this.concertRepo.save(concert);
    }

    reservation.canceled = true;
    return this.reservationRepo.save(reservation);
  }

  async userHistory(userId: number): Promise<Reservation[]> {
    return this.reservationRepo.find({ where: { userId } });
  }

  async allHistory(): Promise<Reservation[]> {
    return this.reservationRepo.find({
      relations: ['user', 'concert'],
      order: { id: 'DESC' },
    });
  }

  async getReservationCount(concertId: number): Promise<number> {
    return this.reservationRepo.count({
      where: {
        concertId,
        canceled: false,
      },
    });
  }

  async getStats() {
    const [totalReservations, activeReservations, canceledReservations] = await Promise.all([
      this.reservationRepo.count(),
      this.reservationRepo.count({ where: { canceled: false } }),
      this.reservationRepo.count({ where: { canceled: true } }),
    ]);

    const totalSeats = await this.concertRepo
      .createQueryBuilder('concert')
      .select('SUM(concert.seat)', 'total')
      .getRawOne();

    return {
      totalSeats: parseInt(totalSeats?.total || '0'),
      reserved: activeReservations,
      cancelled: canceledReservations,
    };
  }
}
