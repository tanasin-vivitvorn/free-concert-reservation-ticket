const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    if (!credentials.username || !credentials.password) {
      throw new Error('Username และ Password จำเป็น');
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
    }

    return data;
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'สมัครสมาชิกไม่สำเร็จ');
    }

    return data;
  }
}

export const authService = new AuthService(); 