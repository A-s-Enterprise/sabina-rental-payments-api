import { Module } from '@nestjs/common';
import { RoomTypeService } from './room-type.service';
import { RoomTypeController } from './room-type.controller';
import { DatabaseModule } from '../db/database.module';
import { IsNameAlreadyExistConstraint } from '../common/validators/IsNameAlreadyExist';

@Module({
  imports: [DatabaseModule],
  providers: [RoomTypeService, IsNameAlreadyExistConstraint],
  controllers: [RoomTypeController],
})
export class RoomTypeModule {}
