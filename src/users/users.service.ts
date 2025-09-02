import { Injectable } from '@nestjs/common';
import { Db } from '../shared/servers/db';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  findAll(): User[] {
    return Db.readData<User[]>('users');
  }

  findOne(id: number): User | undefined {
    const users = this.findAll();
    return users.find(user => user.id === id);
  }

  getUsersByRole(role: 'admin' | 'user'): User[] {
    const users = this.findAll();
    return users.filter(user => user.role === role);
  }

  getUser(): User | undefined {
    const users = this.getUsersByRole('user');
    return users.length > 0 ? users[0] : undefined;
  }

  getAdmin(): User | undefined {
    const admins = this.getUsersByRole('admin');
    return admins.length > 0 ? admins[0] : undefined;
  }
}
