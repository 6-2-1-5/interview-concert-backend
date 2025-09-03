import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
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

  create(createReservationDto: CreateReservationDto): Reservation {
    const reservations = Db.readData<Reservation[]>('reservations');
    const newId =
      reservations.length > 0
        ? Math.max(...reservations.map((r) => r.id)) + 1
        : 1;

    const reservation: Reservation = {
      id: newId,
      userId: createReservationDto.userId,
      concertId: createReservationDto.concertId,
      createdAt: new Date(),
    };

    reservations.push(reservation);
    Db.writeData('reservations', reservations);
    return reservation;
  }

  removeByUserAndConcert(userId: number, concertId: number): boolean {
    const reservations = Db.readData<Reservation[]>('reservations');
    const index = reservations.findIndex(
      (reservation) =>
        reservation.userId === userId && reservation.concertId === concertId,
    );
    if (index === -1) return false;

    reservations.splice(index, 1);
    Db.writeData('reservations', reservations);
    return true;
  }

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

  reserveSeats(concertId: number, userId: number): Concert | null {
    const updatedConcert =
      this.concertsService.incrementReservedSeat(concertId);

    if (!updatedConcert) {
      return null;
    }

    this.create({
      userId,
      concertId,
    });

    this.historiesService.create({
      userId,
      concertId,
      action: 'reserve',
    });

    return updatedConcert;
  }

  unreserveSeats(concertId: number, userId: number): Concert | null {
    const reservationRemoved = this.removeByUserAndConcert(userId, concertId);
    if (!reservationRemoved) {
      return null;
    }

    const updatedConcert =
      this.concertsService.decrementReservedSeat(concertId);
    if (!updatedConcert) {
      this.create({ userId, concertId });
      return null;
    }

    this.historiesService.create({
      userId,
      concertId,
      action: 'cancel',
    });

    return updatedConcert;
  }
}
