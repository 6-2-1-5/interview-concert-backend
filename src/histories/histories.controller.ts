import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { AdminRoleGuard } from '../shared/guards/admin-role.guard';

@Controller('histories')
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

  @Get()
  @UseGuards(AdminRoleGuard)
  findAll() {
    return this.historiesService.findAll();
  }
}
