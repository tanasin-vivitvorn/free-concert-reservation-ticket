import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: any;

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find user by username', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'user',
    };

    mockRepository.findOneBy.mockResolvedValue(mockUser);

    const result = await service.findByUsername('testuser');

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ username: 'testuser' });
    expect(result).toEqual(mockUser);
  });

  it('should return null when user not found by username', async () => {
    mockRepository.findOneBy.mockResolvedValue(null);

    const result = await service.findByUsername('nonexistent');

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ username: 'nonexistent' });
    expect(result).toBeNull();
  });

  it('should find user by id', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'user',
    };

    mockRepository.findOneBy.mockResolvedValue(mockUser);

    const result = await service.findById(1);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(mockUser);
  });

  it('should return null when user not found by id', async () => {
    mockRepository.findOneBy.mockResolvedValue(null);

    const result = await service.findById(999);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    expect(result).toBeNull();
  });

  it('should create a new user', async () => {
    const createUserDto = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
    };

    const hashedPassword = '$2a$10$hashedpassword';
    const mockUser = {
      id: 2,
      ...createUserDto,
      password: hashedPassword,
      role: 'user',
    };

    // Mock that no existing user is found
    mockRepository.findOne.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    mockRepository.create.mockReturnValue(mockUser);
    mockRepository.save.mockResolvedValue(mockUser);

    const result = await service.create(createUserDto);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
    expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
    }));
    expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should throw ConflictException when username already exists', async () => {
    const createUserDto = {
      username: 'existinguser',
      email: 'new@example.com',
      password: 'password123',
    };

    const existingUser = {
      id: 1,
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'hashedpassword',
      role: 'user',
    };

    mockRepository.findOne.mockResolvedValue(existingUser);

    await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
  });

  it('should throw ConflictException when email already exists', async () => {
    const createUserDto = {
      username: 'newuser',
      email: 'existing@example.com',
      password: 'password123',
    };

    const existingUser = {
      id: 1,
      username: 'differentuser',
      email: 'existing@example.com',
      password: 'hashedpassword',
      role: 'user',
    };

    mockRepository.findOne.mockResolvedValue(existingUser);

    await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
  });
});
