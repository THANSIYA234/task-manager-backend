import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/auth/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './login.dto';
import { ApiResponse } from 'src/common/utils/response.util';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    try {
      const hashed = await bcrypt.hash(dto.password, 10);
      const user = await this.userService.createUser({
        name: dto.name,
        email: dto.email,
        password: hashed,
      });
      return { message: 'user created', user };
    } catch (error) {
      console.error('Register error:', error);

      throw error;
    }
  }

  async validateUser(dto: LoginDto) {
    const user = await this.userService.findEmail(dto.email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    if (!user) {
      throw new HttpException(
        ApiResponse.error('Invalid credentials', HttpStatus.UNAUTHORIZED),
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return ApiResponse.success('Login successful', { access_token: token });
  }
}
