import { Concert } from './concert.entity';

describe('Concert Entity', () => {
  it('should create a concert instance', () => {
    const concert = new Concert();
    expect(concert).toBeInstanceOf(Concert);
  });

  it('should have correct properties', () => {
    const concert = new Concert();
    expect(concert).toBeDefined();
    expect(typeof concert.id).toBe('undefined');
    expect(typeof concert.name).toBe('undefined');
    expect(typeof concert.description).toBe('undefined');
    expect(typeof concert.seat).toBe('undefined');
    expect(typeof concert.remain_seat).toBe('undefined');
    expect(typeof concert.date).toBe('undefined');
  });

  it('should set and get properties correctly', () => {
    const concert = new Concert();
    const testDate = new Date('2024-12-25');
    
    concert.name = 'Test Concert';
    concert.description = 'Test Description';
    concert.date = testDate;
    concert.seat = 100;
    concert.remain_seat = 50;

    expect(concert.name).toBe('Test Concert');
    expect(concert.description).toBe('Test Description');
    expect(concert.date).toBe(testDate);
    expect(concert.seat).toBe(100);
    expect(concert.remain_seat).toBe(50);
  });

  it('should handle optional properties', () => {
    const concert = new Concert();
    
    concert.name = 'Test Concert';
    concert.date = new Date();
    concert.seat = 100;

    expect(concert.description).toBeUndefined();
    expect(concert.remain_seat).toBeUndefined();
  });
}); 