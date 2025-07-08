import { UpdateConcertDto } from './update-concert.dto';

describe('UpdateConcertDto', () => {
  it('should create an update concert dto instance', () => {
    const updateConcertDto = new UpdateConcertDto();
    expect(updateConcertDto).toBeInstanceOf(UpdateConcertDto);
  });

  it('should have correct properties', () => {
    const updateConcertDto = new UpdateConcertDto();
    expect(updateConcertDto).toBeDefined();
    expect(typeof updateConcertDto.name).toBe('undefined');
    expect(typeof updateConcertDto.description).toBe('undefined');
    expect(typeof updateConcertDto.seat).toBe('undefined');
    expect(typeof updateConcertDto.date).toBe('undefined');
  });

  it('should set and get properties correctly', () => {
    const updateConcertDto = new UpdateConcertDto();
    const testDate = '2024-12-25T10:00:00.000Z';
    
    updateConcertDto.name = 'Updated Concert';
    updateConcertDto.description = 'Updated Description';
    updateConcertDto.seat = 150;
    updateConcertDto.date = testDate;

    expect(updateConcertDto.name).toBe('Updated Concert');
    expect(updateConcertDto.description).toBe('Updated Description');
    expect(updateConcertDto.seat).toBe(150);
    expect(updateConcertDto.date).toBe(testDate);
  });

  it('should handle optional remain_seat property', () => {
    const updateConcertDto = new UpdateConcertDto();
    
    updateConcertDto.name = 'Updated Concert';
    updateConcertDto.description = 'Updated Description';
    updateConcertDto.seat = 150;
    updateConcertDto.date = '2024-12-25T10:00:00.000Z';
    updateConcertDto.remain_seat = 75;

    expect(updateConcertDto.remain_seat).toBe(75);
  });
}); 