import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { RelationHistoryDto } from './dto/relation-history.dto';
import { History } from './entities/history.entity';
import { Db } from '../shared/servers/db';
import { UsersService } from '../users/users.service';
import { ConcertsService } from '../concerts/concerts.service';
export class HistoriesService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ConcertsService))
    private readonly concertsService: ConcertsService,
  ) {}
  create(createHistoryDto: CreateHistoryDto): History {
    const histories = Db.readData<History[]>('histories');
    const newId =
      histories.length > 0 ? Math.max(...histories.map((h) => h.id)) + 1 : 1;

    const history: History = {
      id: newId,
      userId: createHistoryDto.userId,
      concertId: createHistoryDto.concertId,
      action: createHistoryDto.action,
      createdAt: new Date(),
    };

    histories.push(history);
    Db.writeData('histories', histories);
    return history;
  }

  findAll(): RelationHistoryDto[] {
    const histories = Db.readData<History[]>('histories');

    return histories.map((history) => {
      const user = this.usersService.findOne(history.userId);
      const concert = this.concertsService.findOne(history.concertId);

      return {
        id: history.id,
        user: {
          name: user?.name || 'Unknown User',
        },
        concert: {
          name: concert?.name || 'Unknown Concert',
        },
        action: history.action,
        createdAt: history.createdAt,
      };
    });
  }
}
