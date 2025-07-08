import { CreateReservationDto } from './create-reservation.dto';

describe('CreateReservationDto', () => {
  it('should create a create reservation dto instance', () => {
    const createReservationDto = new CreateReservationDto();
    expect(createReservationDto).toBeInstanceOf(CreateReservationDto);
  });

  it('should have correct properties', () => {
    const createReservationDto = new CreateReservationDto();
    expect(createReservationDto).toBeDefined();
    expect(typeof createReservationDto.concertId).toBe('undefined');
    expect(typeof createReservationDto.userId).toBe('undefined');
  });

  it('should set and get properties correctly', () => {
    const createReservationDto = new CreateReservationDto();
    
    createReservationDto.concertId = 1;
    createReservationDto.userId = 2;

    expect(createReservationDto.concertId).toBe(1);
    expect(createReservationDto.userId).toBe(2);
  });

  it('should handle different concert and user IDs', () => {
    const createReservationDto = new CreateReservationDto();
    
    createReservationDto.concertId = 5;
    createReservationDto.userId = 10;

    expect(createReservationDto.concertId).toBe(5);
    expect(createReservationDto.userId).toBe(10);
  });
}); 