import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsService } from './concerts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Concert } from './concert.entity';
import { ReservationsService } from '../reservations/reservations.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ConcertsService', () => {
  let service: ConcertsService;
  let mockConcertRepo: any;
  let reservationsService: ReservationsService;

  const mockConcertRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
  };

  const mockReservationsService = {
    findReservationsByConcertId: jest.fn(),
    getReservationCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        {
          provide: getRepositoryToken(Concert),
          useValue: mockConcertRepository,
        },
        {
          provide: ReservationsService,
          useValue: mockReservationsService,
        },
      ],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
    mockConcertRepo = module.get(getRepositoryToken(Concert));
    reservationsService = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a concert', async () => {
    const createConcertDto = {
      name: 'Test Concert',
      description: 'Test Description',
      seat: 100,
      date: '2024-12-25T18:00:00Z',
    };

    const mockConcert = {
      id: 1,
      ...createConcertDto,
      date: new Date(createConcertDto.date),
    };

    mockConcertRepository.create.mockReturnValue(mockConcert);
    mockConcertRepository.save.mockResolvedValue(mockConcert);

    const result = await service.create(createConcertDto);

    expect(mockConcertRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      name: createConcertDto.name,
      description: createConcertDto.description,
      seat: createConcertDto.seat,
    }));
    expect(mockConcertRepository.save).toHaveBeenCalledWith(mockConcert);
    expect(result).toEqual(mockConcert);
  });

  it('should find all concerts', async () => {
    const mockConcerts = [
      { id: 1, name: 'Concert 1', description: 'Desc 1', seat: 100, date: new Date('2024-12-25T18:00:00Z') },
      { id: 2, name: 'Concert 2', description: 'Desc 2', seat: 200, date: new Date('2024-12-26T19:00:00Z') },
    ];

    mockConcertRepository.find.mockResolvedValue(mockConcerts);

    const result = await service.findAll();

    expect(mockConcertRepository.find).toHaveBeenCalled();
    expect(result).toEqual(mockConcerts);
  });

  it('should find one concert by id', async () => {
    const mockConcert = {
      id: 1,
      name: 'Test Concert',
      description: 'Test Description',
      seat: 100,
      date: new Date('2024-12-25T18:00:00Z'),
    };

    mockConcertRepository.findOneBy.mockResolvedValue(mockConcert);

    const result = await service.findOne(1);

    expect(mockConcertRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(mockConcert);
  });

  it('should throw NotFoundException when concert not found', async () => {
    mockConcertRepository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    expect(mockConcertRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
  });

  it('should update a concert successfully', async () => {
    const mockConcert = {
      id: 1,
      name: 'Test Concert',
      description: 'Test Description',
      seat: 100,
      date: new Date('2025-12-25T18:00:00Z'), // Future date
    };

    const updateDto = {
      name: 'Updated Concert',
      seat: 150,
    };

    const updatedConcert = { ...mockConcert, ...updateDto };

    mockConcertRepository.findOneBy.mockResolvedValue(mockConcert);
    mockConcertRepository.save.mockResolvedValue(updatedConcert);

    const result = await service.update(1, updateDto);

    expect(mockConcertRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockConcertRepository.save).toHaveBeenCalledWith(updatedConcert);
    expect(result).toEqual(updatedConcert);
  });

  it('should update a concert successfully even if past date', async () => {
    const mockConcert = {
      id: 1,
      name: 'Past Concert',
      description: 'Test Description',
      seat: 100,
      date: new Date('2020-12-25T18:00:00Z'),
    };

    const updateDto = { name: 'Updated Concert' };
    const updatedConcert = { ...mockConcert, ...updateDto };

    mockConcertRepository.findOneBy.mockResolvedValue(mockConcert);
    mockConcertRepository.save.mockResolvedValue(updatedConcert);

    const result = await service.update(1, updateDto);

    expect(mockConcertRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockConcertRepository.save).toHaveBeenCalledWith(updatedConcert);
    expect(result).toEqual(updatedConcert);
  });

  it('should remove a concert successfully', async () => {
    const mockConcert = {
      id: 1,
      name: 'Test Concert',
      description: 'Test Description',
      seat: 100,
      date: new Date('2025-12-25T18:00:00Z'),
    };

    mockConcertRepository.findOneBy.mockResolvedValue(mockConcert);
    mockConcertRepository.remove.mockResolvedValue(mockConcert);

    await service.remove(1);

    expect(mockConcertRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockConcertRepository.remove).toHaveBeenCalledWith(mockConcert);
  });

  it('should throw NotFoundException when removing non-existent concert', async () => {
    mockConcertRepository.findOneBy.mockResolvedValue(null);

    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    expect(mockConcertRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
  });


});
