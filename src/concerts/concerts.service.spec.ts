import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsService } from './concerts.service';
import { ReservationsService } from '../reservations/reservations.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { Concert } from './entities/concert.entity';

// Mock the Db module
jest.mock('../shared/servers/db');

import { Db } from '../shared/servers/db';
const MockedDb = Db as jest.Mocked<typeof Db>;

// Set up the mock methods
MockedDb.readData = jest.fn();
MockedDb.writeData = jest.fn();

describe('ConcertsService', () => {
  let service: ConcertsService;
  let mockReservationsService: jest.Mocked<ReservationsService>;

  const mockConcerts: Concert[] = [
    {
      id: 1,
      name: 'Test Concert 1',
      description: 'Test Description 1',
      seat: 100,
      reservedSeat: 10,
      cancelledSeat: 5,
    },
    {
      id: 2,
      name: 'Test Concert 2',
      description: 'Test Description 2',
      seat: 200,
      reservedSeat: 20,
      cancelledSeat: 0,
    },
  ];

  beforeEach(async () => {
    const mockReservationsServiceProvider = {
      provide: ReservationsService,
      useValue: {
        findByUserId: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ConcertsService, mockReservationsServiceProvider],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
    mockReservationsService = module.get(ReservationsService);

    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Set up default mock return value
    MockedDb.readData.mockReturnValue(mockConcerts);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new concert', () => {
      const createConcertDto: CreateConcertDto = {
        name: 'New Concert',
        description: 'New Description',
        seat: 150,
        reservedSeat: 0,
      };

      MockedDb.readData.mockReturnValue([...mockConcerts]);
      MockedDb.writeData.mockImplementation(() => {});

      const result = service.create(createConcertDto);

      expect(result).toEqual({
        id: 3,
        name: 'New Concert',
        description: 'New Description',
        seat: 150,
        reservedSeat: 0,
        cancelledSeat: 0,
      });
      expect(MockedDb.readData).toHaveBeenCalledWith('concerts');
      expect(MockedDb.writeData).toHaveBeenCalledWith(
        'concerts',
        expect.any(Array),
      );
    });

    it('should create concert with id 1 when no concerts exist', () => {
      const createConcertDto: CreateConcertDto = {
        name: 'First Concert',
        description: 'First Description',
        seat: 100,
        reservedSeat: 0,
      };

      MockedDb.readData.mockReturnValue([]);
      MockedDb.writeData.mockImplementation(() => {});

      const result = service.create(createConcertDto);

      expect(result.id).toBe(1);
    });
  });

  describe('findAll', () => {
    it('should return all concerts', () => {
      MockedDb.readData.mockReturnValue(mockConcerts);

      const result = service.findAll();

      expect(result).toEqual(mockConcerts);
      expect(MockedDb.readData).toHaveBeenCalledWith('concerts');
    });
  });

  describe('findOne', () => {
    it('should return a concert by id', () => {
      MockedDb.readData.mockReturnValue(mockConcerts);

      const result = service.findOne(1);

      expect(result).toEqual(mockConcerts[0]);
    });

    it('should return null if concert not found', () => {
      MockedDb.readData.mockReturnValue(mockConcerts);

      const result = service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a concert and return true', () => {
      MockedDb.readData.mockReturnValue([...mockConcerts]);
      MockedDb.writeData.mockImplementation(() => {});

      const result = service.remove(1);

      expect(result).toBe(true);
      expect(MockedDb.writeData).toHaveBeenCalled();
    });

    it('should return false if concert not found', () => {
      MockedDb.readData.mockReturnValue(mockConcerts);

      const result = service.remove(999);

      expect(result).toBe(false);
      expect(MockedDb.writeData).not.toHaveBeenCalled();
    });
  });

  describe('findAllWithReservationStatus', () => {
    it('should return concerts with reservation status', () => {
      const userId = 1;
      const userReservations = [
        { concertId: 1, userId: 1, id: 1, createdAt: new Date() },
      ];

      // Ensure we only have the original mock concerts
      MockedDb.readData.mockReturnValue([...mockConcerts]);
      mockReservationsService.findByUserId.mockReturnValue(userReservations);

      const result = service.findAllWithReservationStatus(userId);

      expect(result).toHaveLength(2);
      expect(result[0].isReserved).toBe(true);
      expect(result[1].isReserved).toBe(false);
    });
  });

  describe('incrementReservedSeat', () => {
    it('should increment reserved seat count', () => {
      const concertsCopy = [...mockConcerts];
      MockedDb.readData.mockReturnValue(concertsCopy);
      MockedDb.writeData.mockImplementation(() => {});

      const result = service.incrementReservedSeat(1);

      expect(result).toBeTruthy();
      expect(result?.reservedSeat).toBe(11);
      expect(MockedDb.writeData).toHaveBeenCalled();
    });

    it('should return null if concert not found', () => {
      MockedDb.readData.mockReturnValue(mockConcerts);

      const result = service.incrementReservedSeat(999);

      expect(result).toBeNull();
    });

    it('should return null if no available seats', () => {
      const fullConcert = {
        id: 3,
        name: 'Full Concert',
        description: 'Full Description',
        seat: 10,
        reservedSeat: 10,
        cancelledSeat: 0,
      };
      MockedDb.readData.mockReturnValue([fullConcert]);

      const result = service.incrementReservedSeat(3);

      expect(result).toBeNull();
    });
  });

  describe('decrementReservedSeat', () => {
    it('should decrement reserved seat count', () => {
      const concertsCopy = [...mockConcerts];
      MockedDb.readData.mockReturnValue(concertsCopy);
      MockedDb.writeData.mockImplementation(() => {});

      const result = service.decrementReservedSeat(1);

      expect(result).toBeTruthy();
      expect(result?.reservedSeat).toBe(9);
      expect(MockedDb.writeData).toHaveBeenCalled();
    });

    it('should return null if concert not found', () => {
      MockedDb.readData.mockReturnValue(mockConcerts);

      const result = service.decrementReservedSeat(999);

      expect(result).toBeNull();
    });

    it('should return null if no reserved seats to decrement', () => {
      const noreservedConcert = {
        id: 3,
        name: 'No Reserved Concert',
        description: 'No Reserved Description',
        seat: 10,
        reservedSeat: 0,
        cancelledSeat: 0,
      };
      MockedDb.readData.mockReturnValue([noreservedConcert]);

      const result = service.decrementReservedSeat(3);

      expect(result).toBeNull();
    });
  });

  describe('incrementCancelledSeat', () => {
    it('should increment cancelled seat count', () => {
      const concertsCopy = [...mockConcerts];
      MockedDb.readData.mockReturnValue(concertsCopy);
      MockedDb.writeData.mockImplementation(() => {});

      const result = service.incrementCancelledSeat(1);

      expect(result).toBeTruthy();
      expect(result?.cancelledSeat).toBe(6);
      expect(MockedDb.writeData).toHaveBeenCalled();
    });

    it('should return null if concert not found', () => {
      MockedDb.readData.mockReturnValue(mockConcerts);

      const result = service.incrementCancelledSeat(999);

      expect(result).toBeNull();
    });
  });
});
