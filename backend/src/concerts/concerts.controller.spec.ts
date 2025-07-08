import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('ConcertsController', () => {
  let controller: ConcertsController;
  let concertsService: ConcertsService;

  const mockConcertsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [
        {
          provide: ConcertsService,
          useValue: mockConcertsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ConcertsController>(ConcertsController);
    concertsService = module.get<ConcertsService>(ConcertsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
    };

    mockConcertsService.create.mockResolvedValue(mockConcert);

    const result = await controller.create(createConcertDto);

    expect(concertsService.create).toHaveBeenCalledWith(createConcertDto);
    expect(result).toEqual(mockConcert);
  });

  it('should find all concerts', async () => {
    const mockConcerts = [
      { id: 1, name: 'Concert 1', description: 'Desc 1', seat: 100, date: '2024-12-25T18:00:00Z' },
      { id: 2, name: 'Concert 2', description: 'Desc 2', seat: 200, date: '2024-12-26T19:00:00Z' },
    ];

    mockConcertsService.findAll.mockResolvedValue(mockConcerts);

    const result = await controller.findAll();

    expect(concertsService.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockConcerts);
  });

  it('should find one concert by id', async () => {
    const mockConcert = {
      id: 1,
      name: 'Test Concert',
      description: 'Test Description',
      seat: 100,
      date: '2024-12-25T18:00:00Z',
    };

    mockConcertsService.findOne.mockResolvedValue(mockConcert);

    const result = await controller.findOne(1);

    expect(concertsService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockConcert);
  });

  it('should throw NotFoundException when concert not found', async () => {
    mockConcertsService.findOne.mockRejectedValue(new NotFoundException('Concert not found'));

    await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    expect(concertsService.findOne).toHaveBeenCalledWith(999);
  });

  it('should update a concert', async () => {
    const updateConcertDto = {
      name: 'Updated Concert',
      seat: 150,
    };

    const mockConcert = {
      id: 1,
      name: 'Updated Concert',
      description: 'Test Description',
      seat: 150,
      date: '2024-12-25T18:00:00Z',
    };

    mockConcertsService.update.mockResolvedValue(mockConcert);

    const result = await controller.update(1, updateConcertDto);

    expect(concertsService.update).toHaveBeenCalledWith(1, updateConcertDto);
    expect(result).toEqual(mockConcert);
  });

  it('should throw BadRequestException when updating past concert', async () => {
    const updateConcertDto = { name: 'Updated Concert' };

    mockConcertsService.update.mockRejectedValue(new BadRequestException('Cannot update past concerts'));

    await expect(controller.update(1, updateConcertDto)).rejects.toThrow(BadRequestException);
    expect(concertsService.update).toHaveBeenCalledWith(1, updateConcertDto);
  });

  it('should remove a concert', async () => {
    mockConcertsService.remove.mockResolvedValue(undefined);

    const result = await controller.remove(1);

    expect(concertsService.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: 'Concert deleted' });
  });


});
