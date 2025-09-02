import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('accounts/user')
  getUserAccount(): User | undefined {
    return this.usersService.getUser();
  }

  @Get('accounts/admin')
  getAdminAccount(): User | undefined {
    return this.usersService.getAdmin();
  }
}
