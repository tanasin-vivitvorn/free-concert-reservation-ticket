import { User, UserRole } from './user.entity';

describe('User Entity', () => {
  it('should create a user instance', () => {
    const user = new User();
    expect(user).toBeInstanceOf(User);
  });

  it('should have correct properties', () => {
    const user = new User();
    expect(user).toBeDefined();
    expect(typeof user.id).toBe('undefined');
    expect(typeof user.username).toBe('undefined');
    expect(typeof user.password).toBe('undefined');
    expect(typeof user.role).toBe('undefined');
  });

  it('should set and get properties correctly', () => {
    const user = new User();
    
    user.username = 'testuser';
    user.password = 'hashedpassword';
    user.role = UserRole.USER;

    expect(user.username).toBe('testuser');
    expect(user.password).toBe('hashedpassword');
    expect(user.role).toBe(UserRole.USER);
  });

  it('should handle admin role', () => {
    const user = new User();
    
    user.username = 'admin';
    user.password = 'adminpass';
    user.role = UserRole.ADMIN;

    expect(user.role).toBe(UserRole.ADMIN);
  });

  it('should handle default values', () => {
    const user = new User();
    
    user.username = 'testuser';
    user.password = 'password';

    expect(user.role).toBeUndefined();
  });
}); 