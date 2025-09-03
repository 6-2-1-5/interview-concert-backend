import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { AuthGuard } from '../shared/guards/auth.guard';
import { UsersService } from '../users/users.service';

describe('ConcertsController', () => {
  let controller: ConcertsController;
  let mockConcertsService: jest.Mocked<ConcertsService>;
  let mockUsersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    mockConcertsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      findAllWithReservationStatus: jest.fn(),
      incrementReservedSeat: jest.fn(),
      decrementReservedSeat: jest.fn(),
      incrementCancelledSeat: jest.fn(),
    } as any;

    mockUsersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [
        {
          provide: ConcertsService,
          useValue: mockConcertsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        AuthGuard,
      ],
    }).compile();

    controller = module.get<ConcertsController>(ConcertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
