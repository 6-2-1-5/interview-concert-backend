import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto';
import { Concert } from './entities/concert.entity';
import { Db } from 'src/shared/servers/db';
import { ReservationsService } from '../reservations/reservations.service';

@Injectable()
export class ConcertsService {
  constructor(
    @Inject(forwardRef(() => ReservationsService))
    private readonly reservationsService: ReservationsService,
  ) {}
  create(createConcertDto: CreateConcertDto): Concert {
    const concerts = Db.readData<Concert[]>('concerts');
    const newId =
      concerts.length > 0 ? Math.max(...concerts.map((c) => c.id)) + 1 : 1;

    const newConcert: Concert = {
      id: newId,
      name: createConcertDto.name,
      description: createConcertDto.description,
      seat: createConcertDto.seat,
      reservedSeat: 0,
      cancelledSeat: 0,
    };

    concerts.push(newConcert);
    Db.writeData('concerts', concerts);

    return newConcert;
  }

  findAll(): Concert[] {
    return Db.readData<Concert[]>('concerts');
  }

  findOne(id: number): Concert | null {
    const concerts = Db.readData<Concert[]>('concerts');
    return concerts.find((concert) => concert.id === id) || null;
  }

  remove(id: number): boolean {
    const concerts = Db.readData<Concert[]>('concerts');
    const concertIndex = concerts.findIndex((concert) => concert.id === id);

    if (concertIndex === -1) {
      return false;
    }

    concerts.splice(concertIndex, 1);
    Db.writeData('concerts', concerts);

    return true;
  }

  findAllWithReservationStatus(
    userId: number,
  ): (Concert & { isReserved: boolean })[] {
    const concerts = this.findAll();
    const userReservations = this.reservationsService.findByUserId(userId);

    return concerts.map((concert) => {
      const isReserved = userReservations.some(
        (reservation) => reservation.concertId === concert.id,
      );
      return {
        ...concert,
        isReserved,
      };
    });
  }
}
