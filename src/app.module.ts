import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConcertsModule } from './concerts/concerts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConcertsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
