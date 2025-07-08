export interface Concert {
  id: number;
  name: string;
  description: string;
  seat: number;
  remain_seat?: number;
  date: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const concertService = {
  async getAllConcerts(): Promise<Concert[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/concerts`);
      if (!response.ok) {
        throw new Error('Failed to fetch concerts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching concerts:', error);
      throw error;
    }
  },

  async getConcertById(id: number): Promise<Concert> {
    try {
      const response = await fetch(`${API_BASE_URL}/concerts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch concert');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching concert:', error);
      throw error;
    }
  },

  async createConcert(concertData: Omit<Concert, 'id'>): Promise<Concert> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/concerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(concertData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create concert');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating concert:', error);
      throw error;
    }
  },

  async updateConcert(id: number, concertData: Partial<Concert>): Promise<Concert> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/concerts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(concertData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update concert');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating concert:', error);
      throw error;
    }
  },

  async deleteConcert(id: number): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/concerts/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete concert');
      }
    } catch (error) {
      console.error('Error deleting concert:', error);
      throw error;
    }
  },
}; 