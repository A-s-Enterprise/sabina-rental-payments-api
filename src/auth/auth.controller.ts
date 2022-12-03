import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { UserTokenData } from '../common/utils';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse()
  @ApiBadRequestResponse({
    description: 'password provided is incorrect.',
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOkResponse()
  @ApiForbiddenResponse()
  @UseGuards(RefreshTokenGuard)
  refresh(@User() user: UserTokenData) {
    return this.authService.refresh(user);
  }
}
