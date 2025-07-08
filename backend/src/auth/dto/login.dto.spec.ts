import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  it('should create a login dto instance', () => {
    const loginDto = new LoginDto();
    expect(loginDto).toBeInstanceOf(LoginDto);
  });

  it('should have correct properties', () => {
    const loginDto = new LoginDto();
    expect(loginDto).toBeDefined();
    expect(typeof loginDto.username).toBe('undefined');
    expect(typeof loginDto.password).toBe('undefined');
  });

  it('should set and get properties correctly', () => {
    const loginDto = new LoginDto();
    
    loginDto.username = 'testuser';
    loginDto.password = 'password123';

    expect(loginDto.username).toBe('testuser');
    expect(loginDto.password).toBe('password123');
  });

  it('should handle empty values', () => {
    const loginDto = new LoginDto();
    
    loginDto.username = '';
    loginDto.password = '';

    expect(loginDto.username).toBe('');
    expect(loginDto.password).toBe('');
  });
}); 