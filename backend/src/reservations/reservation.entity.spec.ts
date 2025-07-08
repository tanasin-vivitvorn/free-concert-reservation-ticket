import { Reservation } from './reservation.entity';

describe('Reservation Entity', () => {
  it('should create a reservation instance', () => {
    const reservation = new Reservation();
    expect(reservation).toBeInstanceOf(Reservation);
  });

  it('should have correct properties', () => {
    const reservation = new Reservation();
    expect(reservation).toBeDefined();
    expect(typeof reservation.id).toBe('undefined');
    expect(typeof reservation.concertId).toBe('undefined');
    expect(typeof reservation.userId).toBe('undefined');
    expect(typeof reservation.canceled).toBe('undefined');
    expect(typeof reservation.datetime).toBe('undefined');
    expect(typeof reservation.createdAt).toBe('undefined');
    expect(typeof reservation.updatedAt).toBe('undefined');
  });

  it('should set and get properties correctly', () => {
    const reservation = new Reservation();
    const testDate = new Date('2024-12-25');
    
    reservation.concertId = 1;
    reservation.userId = 2;
    reservation.canceled = false;
    reservation.datetime = testDate;

    expect(reservation.concertId).toBe(1);
    expect(reservation.userId).toBe(2);
    expect(reservation.canceled).toBe(false);
    expect(reservation.datetime).toBe(testDate);
  });

  it('should handle default values', () => {
    const reservation = new Reservation();
    
    reservation.concertId = 1;
    reservation.userId = 2;

    expect(reservation.canceled).toBeUndefined();
  });

  it('should handle canceled reservation', () => {
    const reservation = new Reservation();
    
    reservation.concertId = 1;
    reservation.userId = 2;
    reservation.canceled = true;

    expect(reservation.canceled).toBe(true);
  });
}); 