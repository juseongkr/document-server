import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from './dto/auth.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authDto: AuthDto): Promise<void> {
    return this.userRepository.signUp(authDto);
  }

  async signIn(authDto: AuthDto): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validatePassword(authDto);

    if (!username) {
      throw new UnauthorizedException('invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);

    this.logger.debug(
      `Generated Jwt Token with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken };
  }
}
