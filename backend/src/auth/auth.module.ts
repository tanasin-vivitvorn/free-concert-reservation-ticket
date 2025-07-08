import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersModule } from '../users/users.module';
import { environmentConfig } from '../config';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: environmentConfig.jwt.secret,
      signOptions: { expiresIn: environmentConfig.jwt.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
