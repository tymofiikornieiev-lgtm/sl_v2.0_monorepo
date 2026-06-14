import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import CreateUserDto from '../users/dto/create-user.dto';
import { refreshTokenDto } from './dto/refresh-token.dto';
import { AllowAnonymous } from './decorators/allow-anonymous.decorator';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @AllowAnonymous()
  public async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @AllowAnonymous()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('refresh-token')
  @AllowAnonymous()
  @HttpCode(HttpStatus.OK)
  public async refreshToken(@Body() refreshTokenDto: refreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
