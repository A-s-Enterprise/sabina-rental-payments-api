import { Injectable, Logger } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaService } from './prisma.service';

@Injectable()
export class DBHealthIndicator extends HealthIndicator {
  private readonly logger = new Logger(DBHealthIndicator.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      const [{ date = null }] = await this.prisma.$queryRaw<
        { [key: string]: string }[]
      >`SELECT now() as date`;

      return this.getStatus('database', !!date, { date });
    } catch (e) {
      this.logger.error(e);
      // https://www.prisma.io/docs/reference/api-reference/error-reference
      throw new HealthCheckError('Database Health Failed.', {
        message: `Something went wrong with the database connection. Please check the logs for more details`,
      });
    }
  }
}
