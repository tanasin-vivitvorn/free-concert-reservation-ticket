import { IsNotEmpty, IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username ต้องมีแค่ตัวอักษร ตัวเลข และ _ เท่านั้น' })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
    message: 'Password ต้องมีตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ และตัวเลขอย่างน้อย 1 ตัว' 
  })
  password: string;
} 