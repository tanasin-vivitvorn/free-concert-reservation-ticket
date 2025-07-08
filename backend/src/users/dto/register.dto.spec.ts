import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  it('should create a register dto instance', () => {
    const registerDto = new RegisterDto();
    expect(registerDto).toBeInstanceOf(RegisterDto);
  });

  it('should have correct properties', () => {
    const registerDto = new RegisterDto();
    expect(registerDto).toBeDefined();
    expect(typeof registerDto.username).toBe('undefined');
    expect(typeof registerDto.email).toBe('undefined');
    expect(typeof registerDto.password).toBe('undefined');
  });

  it('should set and get properties correctly', () => {
    const registerDto = new RegisterDto();
    
    registerDto.username = 'testuser';
    registerDto.email = 'test@example.com';
    registerDto.password = 'password123';

    expect(registerDto.username).toBe('testuser');
    expect(registerDto.email).toBe('test@example.com');
    expect(registerDto.password).toBe('password123');
  });

  it('should handle empty values', () => {
    const registerDto = new RegisterDto();
    
    registerDto.username = '';
    registerDto.email = '';
    registerDto.password = '';

    expect(registerDto.username).toBe('');
    expect(registerDto.email).toBe('');
    expect(registerDto.password).toBe('');
  });
}); 