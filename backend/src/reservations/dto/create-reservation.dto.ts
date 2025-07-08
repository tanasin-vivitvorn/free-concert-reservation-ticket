import { IsInt, Min, IsOptional, IsDateString } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsInt()
  @Min(1)
  concertId: number;

  @IsOptional()
  @IsDateString()
  datetime?: string;
} 