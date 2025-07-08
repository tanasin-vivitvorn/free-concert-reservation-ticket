import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {},
      }),
    }),
  } as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException when no token provided', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when no authorization header', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: undefined,
          },
        }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when authorization header is not Bearer', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Basic dXNlcjpwYXNz',
          },
        }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when token is invalid', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer invalid-token',
          },
        }),
      }),
    } as ExecutionContext;

    mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should return true when token is valid', async () => {
    const mockPayload = { userId: 1, username: 'testuser', role: 'admin' };
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer valid-token',
          },
        }),
      }),
    } as ExecutionContext;

    mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
  });

  it('should set user payload in request when token is valid', async () => {
    const mockPayload = { userId: 1, username: 'testuser', role: 'admin' };
    const mockRequest: any = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

    await guard.canActivate(context);

    expect(mockRequest['user']).toEqual(mockPayload);
  });

  it('should handle empty authorization header', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: '',
          },
        }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should handle malformed authorization header', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer',
          },
        }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });
}); 