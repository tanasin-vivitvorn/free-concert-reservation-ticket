import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concert } from './concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertRepo: Repository<Concert>,
  ) {}

  async create(dto: CreateConcertDto): Promise<Concert> {
    const concert = this.concertRepo.create({
      ...dto,
      remain_seat: dto.remain_seat ?? dto.seat,
    });
    return this.concertRepo.save(concert);
  }

  async findAll(): Promise<Concert[]> {
    return this.concertRepo.find();
  }

  async findOne(id: number): Promise<Concert> {
    const concert = await this.concertRepo.findOneBy({ id });
    if (!concert) {
      throw new NotFoundException(`Concert with ID ${id} not found`);
    }
    return concert;
  }

  async update(id: number, dto: UpdateConcertDto): Promise<Concert> {
    const concert = await this.findOne(id);
    Object.assign(concert, dto);
    return this.concertRepo.save(concert);
  }

  async remove(id: number): Promise<void> {
    const concert = await this.findOne(id);
    await this.concertRepo.remove(concert);
  }
}
