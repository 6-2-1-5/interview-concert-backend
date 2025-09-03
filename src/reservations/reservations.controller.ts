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
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { UserId } from '../shared/decorators/user-id.decorator';
import { AuthGuard } from '../shared/guards/auth.guard';
import { Concert } from '../concerts/entities/concert.entity';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}
  @Patch(':concertId/reserve')
  @UseGuards(AuthGuard)
  reserveSeat(
    @Param('concertId') concertId: string,
    @UserId() userId: number,
  ): Concert {
    const updatedConcert = this.reservationsService.reserveSeats(
      +concertId,
      userId,
    );
    if (!updatedConcert) {
      throw new HttpException(
        'Concert not found or invalid reservation',
        HttpStatus.BAD_REQUEST,
      );
    }
    return updatedConcert;
  }

  @Patch(':concertId/unreserve')
  @UseGuards(AuthGuard)
  unreserveSeat(
    @Param('concertId') concertId: string,
    @UserId() userId: number,
  ): Concert {
    const updatedConcert = this.reservationsService.unreserveSeats(
      +concertId,
      userId,
    );
    if (!updatedConcert) {
      throw new HttpException(
        'Concert not found or invalid unreservation',
        HttpStatus.BAD_REQUEST,
      );
    }
    return updatedConcert;
  }
}
