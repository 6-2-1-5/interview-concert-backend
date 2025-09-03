import { Test, TestingModule } from '@nestjs/testing';
import { HistoriesController } from './histories.controller';
import { HistoriesService } from './histories.service';
import { AuthGuard } from '../shared/guards/auth.guard';
import { AdminRoleGuard } from '../shared/guards/admin-role.guard';
import { UsersService } from '../users/users.service';

describe('HistoriesController', () => {
  let controller: HistoriesController;

  const mockHistoriesService = {
    findAll: jest.fn(),
    findByUserId: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoriesController],
      providers: [
        {
          provide: HistoriesService,
          useValue: mockHistoriesService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        AuthGuard,
        AdminRoleGuard,
      ],
    }).compile();

    controller = module.get<HistoriesController>(HistoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
