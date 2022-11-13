import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaService } from '../db/prisma.service';
import { HealthController } from './health.controller';
import { DBHealthIndicator } from '../db/database.health';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [TerminusModule, SearchModule],
  controllers: [HealthController],
  providers: [DBHealthIndicator, PrismaService],
})
export class HealthModule {}
