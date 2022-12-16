import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { DBHealthIndicator } from '../db/database.health';
import { SearchHealthIndicator } from './../search/search.health';

@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly dbHealthIndicator: DBHealthIndicator,
    private readonly searchHealthIndicator: SearchHealthIndicator,
  ) {}

  @Get('db')
  @HealthCheck()
  dbHealthCheck() {
    return this.health.check([() => this.dbHealthIndicator.isHealthy()]);
  }

  @Get('elastic')
  @HealthCheck()
  elasticSearchHealthCheck() {
    return this.health.check([() => this.searchHealthIndicator.isHealthy()]);
  }

  @Get('all')
  @HealthCheck()
  getAllHealthChecks() {
    return this.health.check([
      () => this.dbHealthIndicator.isHealthy(),
      () => this.searchHealthIndicator.isHealthy(),
    ]);
  }
}
