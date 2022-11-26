import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateFloorDto } from './dto/create-floor.dto';
import { FloorService } from './floor.service';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { Status } from '@prisma/client';

@Controller('floors')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Get()
  findMany() {
    return this.floorService.findMany({});
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.floorService.findByIdOrThrow(id);
  }

  @Post()
  create(@Body() data: CreateFloorDto) {
    return this.floorService.create(data);
  }

  @Put(':id')
  updateById(@Param('id') id: string, @Body() data: UpdateFloorDto) {
    return this.floorService.updateById(id, data);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.floorService.delete(id);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: Status) {
    return this.floorService.updateStatusById(id, status);
  }
}
