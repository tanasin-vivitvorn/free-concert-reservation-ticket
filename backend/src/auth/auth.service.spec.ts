import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

// Mock bcrypt
jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
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

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return access token and user info on successful login', async () => {
    const loginDto = { username: 'testuser', password: 'password123' };
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: '$2a$10$hashedpassword',
      role: 'user',
    };
    const mockToken = 'mock-jwt-token';

    mockUsersService.findByUsername.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.sign.mockReturnValue(mockToken);

    const result = await service.login(loginDto);

    expect(usersService.findByUsername).toHaveBeenCalledWith(loginDto.username);
    expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: mockUser.id,
      username: mockUser.username,
      role: mockUser.role,
    });
    expect(result).toEqual({
      access_token: mockToken,
      user: {
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
      },
    });
  });

  it('should throw UnauthorizedException when user not found', async () => {
    const loginDto = { username: 'nonexistent', password: 'password123' };

    mockUsersService.findByUsername.mockResolvedValue(null);

    await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    expect(usersService.findByUsername).toHaveBeenCalledWith(loginDto.username);
  });

  it('should throw UnauthorizedException when password is incorrect', async () => {
    const loginDto = { username: 'testuser', password: 'wrongpassword' };
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: '$2a$10$hashedpassword',
      role: 'user',
    };

    mockUsersService.findByUsername.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    expect(usersService.findByUsername).toHaveBeenCalledWith(loginDto.username);
    expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
  });

  it('should handle admin user login', async () => {
    const loginDto = { username: 'admin', password: 'adminpass' };
    const mockUser = {
      id: 2,
      username: 'admin',
      email: 'admin@example.com',
      password: '$2a$10$hashedpassword',
      role: 'admin',
    };
    const mockToken = 'admin-jwt-token';

    mockUsersService.findByUsername.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.sign.mockReturnValue(mockToken);

    const result = await service.login(loginDto);

    expect(usersService.findByUsername).toHaveBeenCalledWith(loginDto.username);
    expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: mockUser.id,
      username: mockUser.username,
      role: mockUser.role,
    });
    expect(result).toEqual({
      access_token: mockToken,
      user: {
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
      },
    });
  });
});
