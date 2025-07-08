import { CreateConcertDto } from './create-concert.dto';

describe('CreateConcertDto', () => {
  it('should create a create concert dto instance', () => {
    const createConcertDto = new CreateConcertDto();
    expect(createConcertDto).toBeInstanceOf(CreateConcertDto);
  });

  it('should have correct properties', () => {
    const createConcertDto = new CreateConcertDto();
    expect(createConcertDto).toBeDefined();
    expect(typeof createConcertDto.name).toBe('undefined');
    expect(typeof createConcertDto.description).toBe('undefined');
    expect(typeof createConcertDto.seat).toBe('undefined');
    expect(typeof createConcertDto.date).toBe('undefined');
  });

  it('should set and get properties correctly', () => {
    const createConcertDto = new CreateConcertDto();
    const testDate = '2024-12-25T10:00:00.000Z';
    
    createConcertDto.name = 'Test Concert';
    createConcertDto.description = 'Test Description';
    createConcertDto.seat = 100;
    createConcertDto.date = testDate;

    expect(createConcertDto.name).toBe('Test Concert');
    expect(createConcertDto.description).toBe('Test Description');
    expect(createConcertDto.seat).toBe(100);
    expect(createConcertDto.date).toBe(testDate);
  });

  it('should handle optional remain_seat property', () => {
    const createConcertDto = new CreateConcertDto();
    
    createConcertDto.name = 'Test Concert';
    createConcertDto.description = 'Test Description';
    createConcertDto.seat = 100;
    createConcertDto.date = '2024-12-25T10:00:00.000Z';
    createConcertDto.remain_seat = 50;

    expect(createConcertDto.remain_seat).toBe(50);
  });
}); 