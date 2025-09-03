import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { AuthGuard } from '../shared/guards/auth.guard';
import { UsersService } from '../users/users.service';

describe('ReservationsController', () => {
  let controller: ReservationsController;

  const mockReservationsService = {
    reserveSeats: jest.fn(),
    unreserveSeats: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: mockReservationsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        AuthGuard,
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
