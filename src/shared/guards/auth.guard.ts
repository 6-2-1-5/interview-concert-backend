import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        role: 'admin' | 'user';
      };
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    // For this example, we willl check for a user ID in header
    // In a real world, this would come from JWT token or session
    const userId = request.headers['user-id'];

    if (!userId) {
      throw new UnauthorizedException(
        'Authentication required: user-id header missing',
      );
    }

    const parsedUserId = Number(userId);
    if (isNaN(parsedUserId)) {
      throw new UnauthorizedException('Invalid user-id format');
    }

    const user = this.usersService.findOne(parsedUserId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    request.user = user;
    return true;
  }
}
