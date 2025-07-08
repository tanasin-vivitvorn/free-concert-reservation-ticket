import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const registerDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      ...registerDto,
      role: 'user',
    };

    mockUsersService.create.mockResolvedValue(mockUser);

    const result = await controller.register(registerDto);

    expect(usersService.create).toHaveBeenCalledWith(registerDto);
    expect(result).toEqual({
      id: mockUser.id,
      username: mockUser.username,
      email: mockUser.email,
      role: mockUser.role,
    });
  });
});
