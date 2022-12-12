import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { IsFloorIdExistConstraint } from './validators/IsFloorIdExist';
import { IsRoomTypeIdExistConstraint } from './validators/IsRoomTypeIdExist';
import { IsFloorLimitReachedConstraint } from './validators/IsFloorLimitReached';

@Module({
  imports: [],
  providers: [
    RoomService,
    IsFloorIdExistConstraint,
    IsRoomTypeIdExistConstraint,
    IsFloorLimitReachedConstraint,
  ],
  controllers: [RoomController],
})
export class RoomModule {}
