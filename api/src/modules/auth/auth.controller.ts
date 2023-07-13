import {
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDTO })
  async login(@Req() req, @Res({ passthrough: true }) res) {
    return this.authService.login(req.user, res);
  }

  @Post('refresh')
  async refresh(@Req() req) {
    if (!req.cookies || !req.cookies.refresh_token) {
      throw new ForbiddenException('No refresh token found');
    }

    return this.authService.refreshToken(req.cookies.refresh_token);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('revoke')
  @HttpCode(HttpStatus.OK)
  async revoke(@Res() res) {
    res.clearCookie('refresh_token', {
      secure: this.configService.get<boolean>('HTTP_SECURE'),
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: this.configService.get('PATH_REFRESH_TOKEN'),
    });
    res.end();
  }
}
