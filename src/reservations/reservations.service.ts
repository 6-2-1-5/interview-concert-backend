import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { ConcertsService } from '../concerts/concerts.service';
import { HistoriesService } from '../histories/histories.service';
import { Concert } from '../concerts/entities/concert.entity';
import { Db } from '../shared/servers/db';

@Injectable()
export class ReservationsService {
  constructor(
    @Inject(forwardRef(() => ConcertsService))
    private readonly concertsService: ConcertsService,
    private readonly historiesService: HistoriesService,
  ) {}
  
  findByUserId(userId: number): any[] {
    const reservations = Db.readData<Reservation[]>('reservations');
    const userReservations = reservations.filter(
      (reservation) => reservation.userId === userId,
    );

    return userReservations.map((reservation) => {
      const concert = this.concertsService.findOne(reservation.concertId);
      return {
        ...reservation,
        concert,
      };
    });
  }
}
