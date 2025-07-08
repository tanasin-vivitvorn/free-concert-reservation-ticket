import { Controller, Post, Body, UsePipes, ValidationPipe, Delete, Param, Get, ParseIntPipe } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async reserve(@Body() dto: CreateReservationDto) {
    return this.reservationsService.reserve(dto);
  }

  @Delete(':userId/:concertId')
  async cancel(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('concertId', ParseIntPipe) concertId: number,
  ) {
    return this.reservationsService.cancel(userId, concertId);
  }

  @Get('user/:userId')
  async userHistory(@Param('userId', ParseIntPipe) userId: number) {
    return this.reservationsService.userHistory(userId);
  }

  @Get('admin/all')
  async allHistory() {
    return this.reservationsService.allHistory();
  }

  @Get('admin/stats')
  async getStats() {
    return this.reservationsService.getStats();
  }
}
