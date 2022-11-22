import { Module } from '@nestjs/common';
import { FloorService } from './floor.service';
import { FloorController } from './floor.controller';
import { DatabaseModule } from '../db/database.module';
import { IsNameAlreadyExistConstraint } from '../common/validators/IsNameAlreadyExist';

@Module({
  imports: [DatabaseModule],
  providers: [FloorService, IsNameAlreadyExistConstraint],
  controllers: [FloorController],
})
export class FloorModule {}
