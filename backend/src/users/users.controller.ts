import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() dto: RegisterDto) {
    const user = await this.usersService.create(dto);
    const { password, ...result } = user;
    return result;
  }
}
