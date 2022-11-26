import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { RoomTypeService } from './room-type.service';

@Controller('room-types')
export class RoomTypeController {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.roomTypeService.findById(id);
  }

  @Post()
  create(@Body() data: CreateRoomTypeDto) {
    return this.roomTypeService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateRoomTypeDto) {
    return this.roomTypeService.updateById(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.roomTypeService.delete(id);
  }
}
