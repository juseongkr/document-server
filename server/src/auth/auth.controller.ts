import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe)
    authDto: AuthDto,
  ): Promise<void> {
    return this.authService.signUp(authDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe)
    authDto: AuthDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authDto);
  }
}
