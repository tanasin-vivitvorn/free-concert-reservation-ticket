import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      ...dto,
      password: hashedPassword,
    });
    return this.userRepo.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOneBy({ username });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOneBy({ id });
  }
}
