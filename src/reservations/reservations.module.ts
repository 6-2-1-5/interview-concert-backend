import { Module, forwardRef } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ConcertsModule } from '../concerts/concerts.module';
import { HistoriesModule } from '../histories/histories.module';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from '../shared/guards/auth.guard';

@Module({
  imports: [forwardRef(() => ConcertsModule), HistoriesModule, UsersModule],
  controllers: [ReservationsController],
  providers: [ReservationsService, AuthGuard],
  exports: [ReservationsService],
})
export class ReservationsModule {}
