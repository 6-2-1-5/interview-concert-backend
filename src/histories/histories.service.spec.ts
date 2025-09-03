import { Test, TestingModule } from '@nestjs/testing';
import { HistoriesService } from './histories.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { History } from './entities/history.entity';
import { Db } from '../shared/servers/db';

// Get the mocked Db
const MockedDb = Db as jest.Mocked<typeof Db>;
import { UsersService } from '../users/users.service';
import { ConcertsService } from '../concerts/concerts.service';

// Mock the Db module
jest.mock('../shared/servers/db', () => ({
  Db: {
    readData: jest.fn(),
    writeData: jest.fn(),
  },
}));

// Use the mocked Db instance

describe('HistoriesService', () => {
  let service: HistoriesService;

  const mockHistories: History[] = [
    {
      id: 1,
      userId: 1,
      concertId: 1,
      action: 'reserve',
      createdAt: new Date('2023-01-01'),
    },
    {
      id: 2,
      userId: 2,
      concertId: 1,
      action: 'cancel',
      createdAt: new Date('2023-01-02'),
    },
    {
      id: 3,
      userId: 1,
      concertId: 2,
      action: 'reserve',
      createdAt: new Date('2023-01-03'),
    },
    {
      id: 4,
      userId: 1,
      concertId: 1,
      action: 'cancel',
      createdAt: new Date('2023-01-04'),
    },
  ];

  let mockUsersService: any;
  let mockConcertsService: any;

  beforeEach(async () => {
    mockUsersService = {
      findOne: jest.fn(),
    };

    mockConcertsService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoriesService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ConcertsService,
          useValue: mockConcertsService,
        },
      ],
    }).compile();

    service = module.get<HistoriesService>(HistoriesService);

    // Setup default mock returns
    mockUsersService.findOne.mockImplementation((id: number) => ({
      id,
      name: `User ${id}`,
      role: 'user',
    }));

    mockConcertsService.findOne.mockImplementation((id: number) => ({
      id,
      name: `Concert ${id}`,
      description: `Description ${id}`,
      seat: 100,
      reservedSeat: 0,
      cancelledSeat: 0,
    }));

    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock data
    MockedDb.readData.mockReturnValue(mockHistories);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new history record', () => {
      const createHistoryDto: CreateHistoryDto = {
        userId: 3,
        concertId: 2,
        action: 'reserve',
      };

      MockedDb.readData.mockReturnValue([...mockHistories]);
      MockedDb.writeData.mockImplementation(() => {});

      const result = service.create(createHistoryDto);

      expect(result).toEqual({
        id: 5,
        userId: 3,
        concertId: 2,
        action: 'reserve',
        createdAt: expect.any(Date),
      });
      expect(MockedDb.readData).toHaveBeenCalledWith('histories');
      expect(MockedDb.writeData).toHaveBeenCalledWith('histories', expect.any(Array));
    });

    it('should create history with id 1 when no histories exist', () => {
      const createHistoryDto: CreateHistoryDto = {
        userId: 1,
        concertId: 1,
        action: 'cancel',
      };

      MockedDb.readData.mockReturnValue([]);
      MockedDb.writeData.mockImplementation(() => {});

      const result = service.create(createHistoryDto);

      expect(result.id).toBe(1);
      expect(result.action).toBe('cancel');
    });

    it('should create history with reserve action', () => {
      const createHistoryDto: CreateHistoryDto = {
        userId: 2,
        concertId: 3,
        action: 'reserve',
      };

      MockedDb.readData.mockReturnValue([...mockHistories]);
      MockedDb.writeData.mockImplementation(() => {});

      const result = service.create(createHistoryDto);

      expect(result.action).toBe('reserve');
      expect(result.userId).toBe(2);
      expect(result.concertId).toBe(3);
    });
  });

  describe('findAll', () => {
    it('should return all history records', () => {
      MockedDb.readData.mockReturnValue([...mockHistories]);
      
      const result = service.findAll();

      expect(result).toHaveLength(4);
      expect(result).toEqual([
        {
          id: 1,
          user: { name: 'User 1' },
          concert: { name: 'Concert 1' },
          action: 'reserve',
          createdAt: new Date('2023-01-01'),
        },
        {
          id: 2,
          user: { name: 'User 2' },
          concert: { name: 'Concert 1' },
          action: 'cancel',
          createdAt: new Date('2023-01-02'),
        },
        {
          id: 3,
          user: { name: 'User 1' },
          concert: { name: 'Concert 2' },
          action: 'reserve',
          createdAt: new Date('2023-01-03'),
        },
        {
          id: 4,
          user: { name: 'User 1' },
          concert: { name: 'Concert 1' },
          action: 'cancel',
          createdAt: new Date('2023-01-04'),
        },
      ]);
      expect(MockedDb.readData).toHaveBeenCalledWith('histories');
    });

    it('should return empty array when no histories exist', () => {
        MockedDb.readData.mockReturnValue([]);

      const result = service.findAll();

      expect(result).toEqual([]);
      expect(MockedDb.readData).toHaveBeenCalledWith('histories');
    });
  });

  describe('findByUserId', () => {
    it('should return histories for a specific user', () => {
      MockedDb.readData.mockReturnValue(mockHistories);
      
      const result = service.findByUserId(1);

      expect(result).toHaveLength(3);
      expect(result).toEqual([
        {
          id: 1,
          user: { name: 'User 1' },
          concert: { name: 'Concert 1' },
          action: 'reserve',
          createdAt: new Date('2023-01-01'),
        },
        {
          id: 3,
          user: { name: 'User 1' },
          concert: { name: 'Concert 2' },
          action: 'reserve',
          createdAt: new Date('2023-01-03'),
        },
        {
          id: 4,
          user: { name: 'User 1' },
          concert: { name: 'Concert 1' },
          action: 'cancel',
          createdAt: new Date('2023-01-04'),
        },
      ]);
      expect(MockedDb.readData).toHaveBeenCalledWith('histories');
    });

    it('should return empty array if user has no history records', () => {
      MockedDb.readData.mockReturnValue(mockHistories);
      
      const result = service.findByUserId(999);

      expect(result).toHaveLength(0);
      expect(MockedDb.readData).toHaveBeenCalledWith('histories');
    });

    it('should return histories with different actions for the same user', () => {
      MockedDb.readData.mockReturnValue(mockHistories);
      
      const result = service.findByUserId(1);

      const reserveActions = result.filter((h) => h.action === 'reserve');
      const cancelActions = result.filter((h) => h.action === 'cancel');
      
      expect(reserveActions).toHaveLength(2);
      expect(cancelActions).toHaveLength(1);
    });
  });
});
