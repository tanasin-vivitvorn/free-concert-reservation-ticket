import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { Concert } from '../concerts/concert.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let mockReservationRepo: any;
  let mockConcertRepo: any;

  const mockReservationRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  };

  const mockConcertRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockReservationRepository,
        },
        {
          provide: getRepositoryToken(Concert),
          useValue: mockConcertRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    mockReservationRepo = module.get(getRepositoryToken(Reservation));
    mockConcertRepo = module.get(getRepositoryToken(Concert));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reserve a seat successfully', async () => {
    const createReservationDto = {
      concertId: 1,
      userId: 1,
      seatNumber: 5,
    };

    const mockConcert = {
      id: 1,
      name: 'Test Concert',
      seat: 100,
      remain_seat: 50,
      date: new Date('2025-12-25'), // Future date
    };

    const mockReservation = {
      id: 1,
      ...createReservationDto,
      canceled: false,
    };

    mockConcertRepo.findOneBy.mockResolvedValue(mockConcert);
    mockReservationRepo.findOneBy.mockResolvedValue(null);
    mockConcertRepo.save.mockResolvedValue(mockConcert);
    mockReservationRepo.create.mockReturnValue(mockReservation);
    mockReservationRepo.save.mockResolvedValue(mockReservation);

    const result = await service.reserve(createReservationDto);

    expect(mockConcertRepo.findOneBy).toHaveBeenCalledWith({ id: createReservationDto.concertId });
    expect(mockReservationRepo.create).toHaveBeenCalledWith(expect.objectContaining({
      ...createReservationDto,
      datetime: expect.any(Date),
    }));
    expect(mockReservationRepo.save).toHaveBeenCalledWith(mockReservation);
    expect(result).toEqual(mockReservation);
  });

  it('should throw NotFoundException when concert not found', async () => {
    const createReservationDto = {
      concertId: 999,
      userId: 1,
      seatNumber: 5,
    };

    mockConcertRepo.findOneBy.mockResolvedValue(null);

    await expect(service.reserve(createReservationDto)).rejects.toThrow(NotFoundException);
    expect(mockConcertRepo.findOneBy).toHaveBeenCalledWith({ id: createReservationDto.concertId });
  });

  it('should throw BadRequestException when reserving past concert', async () => {
    const createReservationDto = {
      concertId: 1,
      userId: 1,
      seatNumber: 5,
    };

    const mockConcert = {
      id: 1,
      name: 'Past Concert',
      seat: 100,
      remain_seat: 50,
      date: new Date('2020-12-25'), // Past date
    };

    mockConcertRepo.findOneBy.mockResolvedValue(mockConcert);

    await expect(service.reserve(createReservationDto)).rejects.toThrow(BadRequestException);
    expect(mockConcertRepo.findOneBy).toHaveBeenCalledWith({ id: createReservationDto.concertId });
  });

  it('should throw BadRequestException when user already reserved', async () => {
    const createReservationDto = {
      concertId: 1,
      userId: 1,
      seatNumber: 5,
    };

    const mockConcert = {
      id: 1,
      name: 'Test Concert',
      seat: 100,
      remain_seat: 50,
      date: new Date('2025-12-25'),
    };

    const existingReservation = {
      id: 1,
      concertId: 1,
      userId: 1,
      seatNumber: 5,
      canceled: false,
    };

    mockConcertRepo.findOneBy.mockResolvedValue(mockConcert);
    mockReservationRepo.findOneBy.mockResolvedValue(existingReservation);

    await expect(service.reserve(createReservationDto)).rejects.toThrow(BadRequestException);
    expect(mockReservationRepo.findOneBy).toHaveBeenCalledWith({
      userId: createReservationDto.userId,
      concertId: createReservationDto.concertId,
      canceled: false,
    });
  });

  it('should throw BadRequestException when no seats available', async () => {
    const createReservationDto = {
      concertId: 1,
      userId: 1,
      seatNumber: 5,
    };

    const mockConcert = {
      id: 1,
      name: 'Test Concert',
      seat: 100,
      remain_seat: 0,
      date: new Date('2025-12-25'),
    };

    mockConcertRepo.findOneBy.mockResolvedValue(mockConcert);
    mockReservationRepo.findOneBy.mockResolvedValue(null);

    await expect(service.reserve(createReservationDto)).rejects.toThrow(BadRequestException);
    expect(mockConcertRepo.findOneBy).toHaveBeenCalledWith({ id: createReservationDto.concertId });
  });

  it('should cancel a reservation successfully', async () => {
    const userId = 1;
    const concertId = 1;

    const mockReservation = {
      id: 1,
      concertId: 1,
      userId: 1,
      seatNumber: 5,
      canceled: false,
    };

    const mockConcert = {
      id: 1,
      name: 'Test Concert',
      seat: 100,
      remain_seat: 50,
      date: new Date('2025-12-25'),
    };

    const canceledReservation = { ...mockReservation, canceled: true };

    mockReservationRepo.findOneBy.mockResolvedValue(mockReservation);
    mockConcertRepo.findOneBy.mockResolvedValue(mockConcert);
    mockConcertRepo.save.mockResolvedValue(mockConcert);
    mockReservationRepo.save.mockResolvedValue(canceledReservation);

    const result = await service.cancel(userId, concertId);

    expect(mockReservationRepo.findOneBy).toHaveBeenCalledWith({
      userId,
      concertId,
      canceled: false,
    });
    expect(mockReservationRepo.save).toHaveBeenCalledWith(canceledReservation);
    expect(result).toEqual(canceledReservation);
  });

  it('should throw NotFoundException when canceling non-existent reservation', async () => {
    const userId = 1;
    const concertId = 1;

    mockReservationRepo.findOneBy.mockResolvedValue(null);

    await expect(service.cancel(userId, concertId)).rejects.toThrow(NotFoundException);
    expect(mockReservationRepo.findOneBy).toHaveBeenCalledWith({
      userId,
      concertId,
      canceled: false,
    });
  });

  it('should throw BadRequestException when canceling past concert', async () => {
    const userId = 1;
    const concertId = 1;

    const mockReservation = {
      id: 1,
      concertId: 1,
      userId: 1,
      seatNumber: 5,
      canceled: false,
    };

    const mockConcert = {
      id: 1,
      name: 'Past Concert',
      seat: 100,
      remain_seat: 50,
      date: new Date('2020-12-25'), // Past date
    };

    mockReservationRepo.findOneBy.mockResolvedValue(mockReservation);
    mockConcertRepo.findOneBy.mockResolvedValue(mockConcert);

    await expect(service.cancel(userId, concertId)).rejects.toThrow(BadRequestException);
    expect(mockConcertRepo.findOneBy).toHaveBeenCalledWith({ id: concertId });
  });

  it('should get user history', async () => {
    const userId = 1;
    const mockReservations = [
      { id: 1, concertId: 1, userId: 1, seatNumber: 5, canceled: false },
      { id: 2, concertId: 2, userId: 1, seatNumber: 6, canceled: true },
    ];

    mockReservationRepo.find.mockResolvedValue(mockReservations);

    const result = await service.userHistory(userId);

    expect(mockReservationRepo.find).toHaveBeenCalledWith({ where: { userId } });
    expect(result).toEqual(mockReservations);
  });

  it('should get all history', async () => {
    const mockReservations = [
      { id: 1, concertId: 1, userId: 1, seatNumber: 5, canceled: false },
      { id: 2, concertId: 1, userId: 2, seatNumber: 6, canceled: true },
    ];

    mockReservationRepo.find.mockResolvedValue(mockReservations);

    const result = await service.allHistory();

    expect(mockReservationRepo.find).toHaveBeenCalled();
    expect(result).toEqual(mockReservations);
  });

  it('should get reservation count for concert', async () => {
    const concertId = 1;
    const expectedCount = 50;

    mockReservationRepo.count.mockResolvedValue(expectedCount);

    const result = await service.getReservationCount(concertId);

    expect(mockReservationRepo.count).toHaveBeenCalledWith({
      where: {
        concertId,
        canceled: false,
      },
    });
    expect(result).toBe(expectedCount);
  });
});
