import { Module, forwardRef } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { HistoriesController } from './histories.controller';
import { UsersModule } from '../users/users.module';
import { ConcertsModule } from '../concerts/concerts.module';

@Module({
  imports: [UsersModule, forwardRef(() => ConcertsModule)],
  controllers: [HistoriesController],
  providers: [HistoriesService],
  exports: [HistoriesService],
})
export class HistoriesModule {}
