import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../users/user.entity';
import { Concert } from '../concerts/concert.entity';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Concert)
    private readonly concertRepo: Repository<Concert>,
  ) {}

  private async waitForDatabase(retries = 30, delay = 2000): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.userRepo.query('SELECT 1');
        console.log('Database is ready!');
        return;
      } catch (error) {
        console.log(
          `Database not ready, retrying in ${delay}ms... (${i + 1}/${retries})`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error('Database connection timeout');
  }

  private async seedAll(): Promise<void> {
    await this.seedUsers();
    await this.seedConcerts();
  }

  private async seedUsers(): Promise<void> {
    const existingUsers = await this.userRepo.count();
    if (existingUsers === 0) {
      console.log('No users found, starting to seed users...');
      const usersData = [
        {
          username: 'admin',
          email: 'admin@example.com',
          password: 'admin123',
          role: UserRole.ADMIN,
        },
        {
          username: 'user',
          email: 'user@example.com',
          password: 'user123',
          role: UserRole.USER,
        },
      ];

      for (const userData of usersData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.userRepo.create({
          ...userData,
          password: hashedPassword,
        });
        await this.userRepo.save(user);
        console.log(`User created: ${userData.username} (${userData.role})`);
      }
      console.log('Users seeding completed!');
    } else {
      console.log(`Found ${existingUsers} existing users, skipping seeding.`);
    }
  }

  private async seedConcerts(): Promise<void> {
    const existingConcerts = await this.concertRepo.count();
    if (existingConcerts === 0) {
      console.log('No concerts found, starting to seed concerts...');
      const seedData = [
        {
          name: 'คอนเสิร์ตดนตรีคลาสสิก',
          description:
            'คอนเสิร์ตดนตรีคลาสสิกที่ยิ่งใหญ่ที่สุดของปี 2024 พร้อมวงออเคสตร้าชั้นนำของประเทศ',
          seat: 500,
          remain_seat: 500,
          date: new Date('2024-12-25T18:00:00Z'),
        },
        {
          name: 'คอนเสิร์ตป๊อปสตาร์',
          description:
            'คอนเสิร์ตป๊อปที่เต็มไปด้วยความสนุกและความบันเทิง พร้อมศิลปินชื่อดังมากมาย',
          seat: 2000,
          remain_seat: 2000,
          date: new Date('2024-12-30T19:00:00Z'),
        },
        {
          name: 'คอนเสิร์ตแจ๊ส',
          description:
            'สัมผัสเสน่ห์ของดนตรีแจ๊สในบรรยากาศที่อบอุ่นและเป็นกันเอง',
          seat: 300,
          remain_seat: 300,
          date: new Date('2025-07-31T20:00:00Z'),
        },
      ];

      for (const data of seedData) {
        const concert = this.concertRepo.create(data);
        await this.concertRepo.save(concert);
        console.log(`Concert created: ${data.name} (${data.seat} seats)`);
      }
      console.log('Concerts seeding completed!');
    } else {
      console.log(
        `Found ${existingConcerts} existing concerts, skipping seeding.`,
      );
    }
  }


  async seed(): Promise<void> {
    this.logger.log('Starting database seeder...');
    try {
      await this.waitForDatabase();
      await this.seedAll();
      this.logger.log('Database seeding completed!');
    } catch (error) {
      this.logger.error('Seeding failed:', error);
      throw error;
    }
  }


  async seedUsersOnly(): Promise<void> {
    await this.seedUsers();
  }

  async seedConcertsOnly(): Promise<void> {
    await this.seedConcerts();
  }

  async resetAndSeed(): Promise<void> {
    this.logger.log('Resetting database and seeding...');
    await this.userRepo.clear();
    await this.concertRepo.clear();
    await this.seedAll();
  }
}
