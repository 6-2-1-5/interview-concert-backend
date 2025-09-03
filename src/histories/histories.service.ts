import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { History } from './entities/history.entity';
import { Db } from '../shared/servers/db';

@Injectable()
export class HistoriesService {
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

  findAll(): History[] {
    return Db.readData<History[]>('histories');
  }

  findOne(id: number): History | undefined {
    const histories = Db.readData<History[]>('histories');
    return histories.find((history) => history.id === id);
  }

  update(id: number, updateHistoryDto: UpdateHistoryDto): History | undefined {
    const histories = Db.readData<History[]>('histories');
    const index = histories.findIndex((history) => history.id === id);
    if (index === -1) return undefined;

    histories[index] = { ...histories[index], ...updateHistoryDto };
    Db.writeData('histories', histories);
    return histories[index];
  }

  remove(id: number): boolean {
    const histories = Db.readData<History[]>('histories');
    const index = histories.findIndex((history) => history.id === id);
    if (index === -1) return false;

    histories.splice(index, 1);
    Db.writeData('histories', histories);
    return true;
  }
}
