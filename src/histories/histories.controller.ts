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
import { AuthGuard } from '../shared/guards/auth.guard';
import { UserId } from '../shared/decorators/user-id.decorator';

@Controller('histories')
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

  @Get()
  @UseGuards(AdminRoleGuard)
  findAll() {
    return this.historiesService.findAll();
  }

  @Get('my-histories')
  @UseGuards(AuthGuard)
  findMyHistories(@UserId() userId: number) {
    return this.historiesService.findByUserId(userId);
  }
}
