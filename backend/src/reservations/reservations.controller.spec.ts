import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let reservationsService: ReservationsService;

  const mockReservationsService = {
    reserve: jest.fn(),
    cancel: jest.fn(),
    userHistory: jest.fn(),
    allHistory: jest.fn(),
    getStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: mockReservationsService,
        },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    reservationsService = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should reserve a seat', async () => {
    const createReservationDto = {
      concertId: 1,
      userId: 1,
      seatNumber: 5,
    };

    const mockReservation = {
      id: 1,
      ...createReservationDto,
      canceled: false,
    };

    mockReservationsService.reserve.mockResolvedValue(mockReservation);

    const result = await controller.reserve(createReservationDto);

    expect(reservationsService.reserve).toHaveBeenCalledWith(createReservationDto);
    expect(result).toEqual(mockReservation);
  });

  it('should throw NotFoundException when concert not found during reservation', async () => {
    const createReservationDto = {
      concertId: 999,
      userId: 1,
      seatNumber: 5,
    };

    mockReservationsService.reserve.mockRejectedValue(new NotFoundException('Concert not found'));

    await expect(controller.reserve(createReservationDto)).rejects.toThrow(NotFoundException);
    expect(reservationsService.reserve).toHaveBeenCalledWith(createReservationDto);
  });

  it('should throw BadRequestException when reserving past concert', async () => {
    const createReservationDto = {
      concertId: 1,
      userId: 1,
      seatNumber: 5,
    };

    mockReservationsService.reserve.mockRejectedValue(new BadRequestException('Cannot reserve past concerts'));

    await expect(controller.reserve(createReservationDto)).rejects.toThrow(BadRequestException);
    expect(reservationsService.reserve).toHaveBeenCalledWith(createReservationDto);
  });

  it('should throw BadRequestException when user already reserved', async () => {
    const createReservationDto = {
      concertId: 1,
      userId: 1,
      seatNumber: 5,
    };

    mockReservationsService.reserve.mockRejectedValue(new BadRequestException('User already reserved this concert'));

    await expect(controller.reserve(createReservationDto)).rejects.toThrow(BadRequestException);
    expect(reservationsService.reserve).toHaveBeenCalledWith(createReservationDto);
  });

  it('should throw BadRequestException when no seats available', async () => {
    const createReservationDto = {
      concertId: 1,
      userId: 1,
      seatNumber: 5,
    };

    mockReservationsService.reserve.mockRejectedValue(new BadRequestException('No seats available'));

    await expect(controller.reserve(createReservationDto)).rejects.toThrow(BadRequestException);
    expect(reservationsService.reserve).toHaveBeenCalledWith(createReservationDto);
  });

  it('should cancel a reservation', async () => {
    const userId = 1;
    const concertId = 1;
    const mockReservation = {
      id: 1,
      concertId: 1,
      userId: 1,
      seatNumber: 5,
      canceled: true,
    };

    mockReservationsService.cancel.mockResolvedValue(mockReservation);

    const result = await controller.cancel(userId, concertId);

    expect(reservationsService.cancel).toHaveBeenCalledWith(userId, concertId);
    expect(result).toEqual(mockReservation);
  });

  it('should throw NotFoundException when canceling non-existent reservation', async () => {
    const userId = 1;
    const concertId = 1;

    mockReservationsService.cancel.mockRejectedValue(new NotFoundException('Reservation not found'));

    await expect(controller.cancel(userId, concertId)).rejects.toThrow(NotFoundException);
    expect(reservationsService.cancel).toHaveBeenCalledWith(userId, concertId);
  });

  it('should throw BadRequestException when canceling past concert', async () => {
    const userId = 1;
    const concertId = 1;

    mockReservationsService.cancel.mockRejectedValue(new BadRequestException('Cannot cancel past concerts'));

    await expect(controller.cancel(userId, concertId)).rejects.toThrow(BadRequestException);
    expect(reservationsService.cancel).toHaveBeenCalledWith(userId, concertId);
  });

  it('should get user history', async () => {
    const userId = 1;
    const mockReservations = [
      { id: 1, concertId: 1, userId: 1, seatNumber: 5, canceled: false },
      { id: 2, concertId: 2, userId: 1, seatNumber: 6, canceled: true },
    ];

    mockReservationsService.userHistory.mockResolvedValue(mockReservations);

    const result = await controller.userHistory(userId);

    expect(reservationsService.userHistory).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockReservations);
  });

  it('should get all history for admin', async () => {
    const mockReservations = [
      { id: 1, concertId: 1, userId: 1, seatNumber: 5, canceled: false },
      { id: 2, concertId: 1, userId: 2, seatNumber: 6, canceled: true },
      { id: 3, concertId: 2, userId: 3, seatNumber: 7, canceled: false },
    ];

    mockReservationsService.allHistory.mockResolvedValue(mockReservations);

    const result = await controller.allHistory();

    expect(reservationsService.allHistory).toHaveBeenCalled();
    expect(result).toEqual(mockReservations);
  });

  it('should get stats', async () => {
    const mockStats = {
      totalSeats: 1000,
      reserved: 500,
      cancelled: 50,
    };

    mockReservationsService.getStats.mockResolvedValue(mockStats);

    const result = await controller.getStats();

    expect(reservationsService.getStats).toHaveBeenCalled();
    expect(result).toEqual(mockStats);
  });
});
