import { Module } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { ConcertsController } from './concerts.controller';
import { UsersModule } from '../users/users.module';
import { AdminRoleGuard } from '../shared/guards/admin-role.guard';

@Module({
  imports: [UsersModule],
  controllers: [ConcertsController],
  providers: [ConcertsService, AdminRoleGuard],
})
export class ConcertsModule {}
