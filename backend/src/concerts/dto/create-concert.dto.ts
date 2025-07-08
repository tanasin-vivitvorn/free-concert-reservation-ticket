import { IsNotEmpty, IsString, IsInt, Min, IsDateString, IsOptional } from 'class-validator';

export class CreateConcertDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  seat: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  remain_seat?: number;

  @IsDateString()
  date: string;
} 