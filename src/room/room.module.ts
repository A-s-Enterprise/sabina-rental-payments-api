import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { DatabaseModule } from '../db/database.module';
import { IsNameAlreadyExistConstraint } from '../common/validators/IsNameAlreadyExist';

@Module({
  imports: [DatabaseModule],
  providers: [RoomService, IsNameAlreadyExistConstraint],
  controllers: [RoomController],
})
export class RoomModule {}
