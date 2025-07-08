import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsDateString,
} from 'class-validator';

export class UpdateConcertDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  seat?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  remain_seat?: number;

  @IsOptional()
  @IsDateString()
  date?: string;
} 