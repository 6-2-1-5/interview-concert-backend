import { UseGuards } from '@nestjs/common';
import { AdminRoleGuard } from '../guards/admin-role.guard';

export const AdminOnly = () => UseGuards(AdminRoleGuard);