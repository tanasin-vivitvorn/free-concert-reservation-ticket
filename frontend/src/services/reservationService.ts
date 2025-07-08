

export interface Reservation {
  id: number;
  userId: number;
  concertId: number;
  canceled: boolean;
  datetime?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    username: string;
  };
  concert?: {
    id: number;
    name: string;
  };
}

export interface CreateReservationDto {
  userId: number;
  concertId: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ReservationService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async createReservation(concertId: number): Promise<Reservation> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        userId: user.id,
        concertId: concertId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'เกิดข้อผิดพลาดในการจอง');
    }

    return response.json();
  }

  async cancelReservation(concertId: number): Promise<Reservation> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const response = await fetch(`${API_BASE_URL}/reservations/${user.id}/${concertId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'เกิดข้อผิดพลาดในการยกเลิก');
    }

    return response.json();
  }

  async getUserReservations(): Promise<Reservation[]> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const response = await fetch(`${API_BASE_URL}/reservations/user/${user.id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'เกิดข้อผิดพลาดในการโหลดประวัติการจอง');
    }

    return response.json();
  }

  async getAllReservations(): Promise<Reservation[]> {
    const response = await fetch(`${API_BASE_URL}/reservations/admin/all`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'เกิดข้อผิดพลาดในการโหลดประวัติการจองทั้งหมด');
    }

    return response.json();
  }

  async getStats(): Promise<{ totalSeats: number; reserved: number; cancelled: number }> {
    const response = await fetch(`${API_BASE_URL}/reservations/admin/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'เกิดข้อผิดพลาดในการโหลดสถิติ');
    }

    return response.json();
  }
}

export const reservationService = new ReservationService(); 