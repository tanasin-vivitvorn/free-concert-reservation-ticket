import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockUsersService = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call authService.login when login is called', async () => {
    const loginDto = { username: 'testuser', password: 'password123' };
    const expectedResult = {
      access_token: 'mock-token',
      user: { id: 1, username: 'testuser', email: 'test@example.com', role: 'user' },
    };

    mockAuthService.login.mockResolvedValue(expectedResult);

    const result = await controller.login(loginDto);

    expect(authService.login).toHaveBeenCalledWith(loginDto);
    expect(result).toEqual(expectedResult);
  });
});
