import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { User } from '../common/decorators/user.decorator';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { UserTokenData } from '../common/utils';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(200)
  @UseGuards(RefreshTokenGuard)
  refresh(@User() user: UserTokenData) {
    return this.authService.refresh(user);
  }
}
