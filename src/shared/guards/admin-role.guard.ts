import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // For this example, we willl check for a user ID in header
    // In a real world, this would come from JWT token or session
    const userId = request.headers['user-id'];

    if (!userId) {
      throw new ForbiddenException('User ID is required');
    }

    const user = this.usersService.findOne(Number(userId));

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (user.role !== 'admin') {
      throw new ForbiddenException('Admin role required');
    }

    return true;
  }
}
