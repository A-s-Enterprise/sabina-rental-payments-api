import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../guards/admin.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { UserActiveGuard } from '../guards/user-active.guard';

export function ControllerWithAuth(path: string) {
  return applyDecorators(
    Controller(path),
    ApiTags(path),
    UseGuards(JwtGuard, AdminGuard, UserActiveGuard),
    ApiBearerAuth(),
  );
}
