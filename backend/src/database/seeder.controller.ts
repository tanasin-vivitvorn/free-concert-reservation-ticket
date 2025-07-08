import { Controller, Post, Get } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('seed-users')
  async seedUsers() {
    await this.seederService.seedUsersOnly();
    return { message: 'Users seeded successfully' };
  }

  @Post('seed-concerts')
  async seedConcerts() {
    await this.seederService.seedConcertsOnly();
    return { message: 'Concerts seeded successfully' };
  }

  @Post('seed-all')
  async seedAll() {
    await this.seederService.resetAndSeed();
    return { message: 'All data seeded successfully' };
  }

  @Get('status')
  async getStatus() {
    return { message: 'Seeder service is running' };
  }
} 