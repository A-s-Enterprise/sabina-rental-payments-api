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

@Controller('floors')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.floorService.findById(id);
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
    return this.floorService.deleteById(id);
  }

  @Put(':id/status')
  updateStatus() {}
}
