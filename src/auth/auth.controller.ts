import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './create-user.dto';
import { LoginDto } from './login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'create ' })
  createAuth(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'login' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: any) {
    return req.user;
  }
}
