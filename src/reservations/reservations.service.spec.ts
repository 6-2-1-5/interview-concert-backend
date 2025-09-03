import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { ConcertsService } from '../concerts/concerts.service';
import { HistoriesService } from '../histories/histories.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { Db } from '../shared/servers/db';

// Mock the Db module
jest.mock('../shared/servers/db');
const mockDb = Db as jest.Mocked<typeof Db>;

describe('ReservationsService', () => {
  let service: ReservationsService;
  let mockConcertsService: jest.Mocked<ConcertsService>;
  let mockHistoriesService: jest.Mocked<HistoriesService>;

  const mockReservations: Reservation[] = [
    {
      id: 1,
      userId: 1,
      concertId: 1,
      createdAt: new Date('2023-01-01'),
    },
    {
      id: 2,
      userId: 2,
      concertId: 1,
      createdAt: new Date('2023-01-02'),
    },
    {
      id: 3,
      userId: 1,
      concertId: 2,
      createdAt: new Date('2023-01-03'),
    },
  ];

  const mockConcert: Concert = {
    id: 1,
    name: 'Test Concert',
    description: 'Test Description',
    seat: 100,
    reservedSeat: 10,
    cancelledSeat: 0,
  };

  beforeEach(async () => {
    const mockConcertsServiceProvider = {
      provide: ConcertsService,
      useValue: {
        findOne: jest.fn(),
        incrementReservedSeat: jest.fn(),
        decrementReservedSeat: jest.fn(),
      },
    };

    const mockHistoriesServiceProvider = {
      provide: HistoriesService,
      useValue: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        mockConcertsServiceProvider,
        mockHistoriesServiceProvider,
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    mockConcertsService = module.get(ConcertsService);
    mockHistoriesService = module.get(HistoriesService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new reservation', () => {
      const createReservationDto: CreateReservationDto = {
        userId: 3,
        concertId: 1,
      };

      mockDb.readData.mockReturnValue(mockReservations);
      mockDb.writeData.mockImplementation(() => {});

      const result = service.create(createReservationDto);

      expect(result).toEqual({
        id: 4,
        userId: 3,
        concertId: 1,
        createdAt: expect.any(Date),
      });
      expect(mockDb.readData).toHaveBeenCalledWith('reservations');
      expect(mockDb.writeData).toHaveBeenCalledWith('reservations', expect.any(Array));
    });

    it('should create reservation with id 1 when no reservations exist', () => {
      const createReservationDto: CreateReservationDto = {
        userId: 1,
        concertId: 1,
      };

      mockDb.readData.mockReturnValue([]);
      mockDb.writeData.mockImplementation(() => {});

      const result = service.create(createReservationDto);

      expect(result.id).toBe(1);
    });
  });

  describe('removeByUserAndConcert', () => {
    it('should remove reservation and return true', () => {
      const reservationsCopy = [...mockReservations];
      mockDb.readData.mockReturnValue(reservationsCopy);
      mockDb.writeData.mockImplementation(() => {});

      const result = service.removeByUserAndConcert(1, 1);

      expect(result).toBe(true);
      expect(mockDb.writeData).toHaveBeenCalled();
    });

    it('should return false if reservation not found', () => {
      mockDb.readData.mockReturnValue(mockReservations);

      const result = service.removeByUserAndConcert(999, 999);

      expect(result).toBe(false);
      expect(mockDb.writeData).not.toHaveBeenCalled();
    });
  });

  describe('findByUserId', () => {
    it('should return reservations for a specific user with concert details', () => {
      mockDb.readData.mockReturnValue(mockReservations);
      mockConcertsService.findOne.mockReturnValue(mockConcert);

      const result = service.findByUserId(1);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        ...mockReservations[0],
        concert: mockConcert,
      });
      expect(mockConcertsService.findOne).toHaveBeenCalledWith(1);
      expect(mockConcertsService.findOne).toHaveBeenCalledWith(2);
    });

    it('should return empty array if user has no reservations', () => {
      mockDb.readData.mockReturnValue(mockReservations);

      const result = service.findByUserId(999);

      expect(result).toHaveLength(0);
    });
  });

  describe('reserveSeats', () => {
    it('should successfully reserve seats', () => {
      const updatedConcert = { ...mockConcert, reservedSeat: 11 };
      mockConcertsService.incrementReservedSeat.mockReturnValue(updatedConcert);
      mockDb.readData.mockReturnValue(mockReservations);
      mockDb.writeData.mockImplementation(() => {});
      mockHistoriesService.create.mockReturnValue({
        id: 1,
        userId: 1,
        concertId: 1,
        action: 'reserve',
        createdAt: new Date(),
      });

      const result = service.reserveSeats(1, 1);

      expect(result).toEqual(updatedConcert);
      expect(mockConcertsService.incrementReservedSeat).toHaveBeenCalledWith(1);
      expect(mockHistoriesService.create).toHaveBeenCalledWith({
        userId: 1,
        concertId: 1,
        action: 'reserve',
      });
    });

    it('should return null if concert update fails', () => {
      mockConcertsService.incrementReservedSeat.mockReturnValue(null);

      const result = service.reserveSeats(1, 1);

      expect(result).toBeNull();
      expect(mockHistoriesService.create).not.toHaveBeenCalled();
    });
  });

  describe('unreserveSeats', () => {
    it('should successfully unreserve seats', () => {
      const reservationsCopy = [...mockReservations];
      const updatedConcert = { ...mockConcert, reservedSeat: 9 };
      
      mockDb.readData.mockReturnValue(reservationsCopy);
      mockDb.writeData.mockImplementation(() => {});
      mockConcertsService.decrementReservedSeat.mockReturnValue(updatedConcert);
      mockHistoriesService.create.mockReturnValue({
        id: 1,
        userId: 1,
        concertId: 1,
        action: 'cancel',
        createdAt: new Date(),
      });

      const result = service.unreserveSeats(1, 1);

      expect(result).toEqual(updatedConcert);
      expect(mockConcertsService.decrementReservedSeat).toHaveBeenCalledWith(1);
      expect(mockHistoriesService.create).toHaveBeenCalledWith({
        userId: 1,
        concertId: 1,
        action: 'cancel',
      });
    });

    it('should return null if reservation not found', () => {
      mockDb.readData.mockReturnValue(mockReservations);

      const result = service.unreserveSeats(999, 999);

      expect(result).toBeNull();
      expect(mockConcertsService.decrementReservedSeat).not.toHaveBeenCalled();
    });

    it('should return null and restore reservation if concert update fails', () => {
      const reservationsCopy = [...mockReservations];
      mockDb.readData.mockReturnValue(reservationsCopy);
      mockDb.writeData.mockImplementation(() => {});
      mockConcertsService.decrementReservedSeat.mockReturnValue(null);

      const result = service.unreserveSeats(1, 1);

      expect(result).toBeNull();
      expect(mockDb.writeData).toHaveBeenCalledTimes(2); // Once for removal, once for restoration
    });
  });
});
