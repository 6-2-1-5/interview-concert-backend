import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { Concert } from './entities/concert.entity';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Post()
  create(@Body() createConcertDto: CreateConcertDto): Concert {
    return this.concertsService.create(createConcertDto);
  }

  @Get()
  findAll(): Concert[] {
    return this.concertsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Concert {
    const concert = this.concertsService.findOne(+id);
    if (!concert) {
      throw new HttpException('Concert not found', HttpStatus.NOT_FOUND);
    }
    return concert;
  }

  @Delete(':id')
  remove(@Param('id') id: string): { message: string } {
    const deleted = this.concertsService.remove(+id);
    if (!deleted) {
      throw new HttpException('Concert not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Concert deleted successfully' };
  }
}
