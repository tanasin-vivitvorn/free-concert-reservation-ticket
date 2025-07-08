import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'กรุณากรอก username' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'กรุณากรอก password' })
  @IsString()
  password: string;
} 