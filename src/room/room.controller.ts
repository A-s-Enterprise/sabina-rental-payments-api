import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.roomService.findByIdOrThrow(id);
  }

  @Post()
  create(@Body() data: CreateRoomDto) {
    return this.roomService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateRoomDto) {
    return this.roomService.updateById(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.roomService.delete(id);
  }
}
