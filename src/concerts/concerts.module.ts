import { Module, forwardRef } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { ConcertsController } from './concerts.controller';
import { UsersModule } from '../users/users.module';
import { ReservationsModule } from '../reservations/reservations.module';
import { AdminRoleGuard } from '../shared/guards/admin-role.guard';
import { AuthGuard } from '../shared/guards/auth.guard';

@Module({
  imports: [UsersModule, forwardRef(() => ReservationsModule)],
  controllers: [ConcertsController],
  providers: [ConcertsService, AdminRoleGuard, AuthGuard],
  exports: [ConcertsService],
})
export class ConcertsModule {}
