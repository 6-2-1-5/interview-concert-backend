import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Db } from '../shared/servers/db';

// Mock the Db module
jest.mock('../shared/servers/db');
const mockDb = Db as jest.Mocked<typeof Db>;

describe('UsersService', () => {
  let service: UsersService;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      role: 'user',
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'admin',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      role: 'user',
    },
    {
      id: 4,
      name: 'Alice Brown',
      role: 'admin',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', () => {
      mockDb.readData.mockReturnValue(mockUsers);

      const result = service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockDb.readData).toHaveBeenCalledWith('users');
    });

    it('should return empty array when no users exist', () => {
      mockDb.readData.mockReturnValue([]);

      const result = service.findAll();

      expect(result).toEqual([]);
      expect(mockDb.readData).toHaveBeenCalledWith('users');
    });
  });

  describe('findOne', () => {
    it('should return a user by id', () => {
      mockDb.readData.mockReturnValue(mockUsers);

      const result = service.findOne(1);

      expect(result).toEqual(mockUsers[0]);
    });

    it('should return undefined if user not found', () => {
      mockDb.readData.mockReturnValue(mockUsers);

      const result = service.findOne(999);

      expect(result).toBeUndefined();
    });

    it('should return undefined when no users exist', () => {
      mockDb.readData.mockReturnValue([]);

      const result = service.findOne(1);

      expect(result).toBeUndefined();
    });
  });

  describe('getUsersByRole', () => {
    it('should return users with admin role', () => {
      mockDb.readData.mockReturnValue(mockUsers);

      const result = service.getUsersByRole('admin');

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        mockUsers[1], // Jane Smith
        mockUsers[3], // Alice Brown
      ]);
      expect(result.every(user => user.role === 'admin')).toBe(true);
    });

    it('should return users with user role', () => {
      mockDb.readData.mockReturnValue(mockUsers);

      const result = service.getUsersByRole('user');

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        mockUsers[0], // John Doe
        mockUsers[2], // Bob Johnson
      ]);
      expect(result.every(user => user.role === 'user')).toBe(true);
    });

    it('should return empty array if no users with specified role exist', () => {
      const usersWithoutAdmins = mockUsers.filter(user => user.role !== 'admin');
      mockDb.readData.mockReturnValue(usersWithoutAdmins);

      const result = service.getUsersByRole('admin');

      expect(result).toEqual([]);
    });

    it('should return empty array when no users exist', () => {
      mockDb.readData.mockReturnValue([]);

      const result = service.getUsersByRole('user');

      expect(result).toEqual([]);
    });
  });

  describe('getUser', () => {
    it('should return the first user with user role', () => {
      mockDb.readData.mockReturnValue(mockUsers);

      const result = service.getUser();

      expect(result).toEqual(mockUsers[0]); // John Doe
      expect(result?.role).toBe('user');
    });

    it('should return undefined if no users with user role exist', () => {
      const onlyAdmins = mockUsers.filter(user => user.role === 'admin');
      mockDb.readData.mockReturnValue(onlyAdmins);

      const result = service.getUser();

      expect(result).toBeUndefined();
    });

    it('should return undefined when no users exist', () => {
      mockDb.readData.mockReturnValue([]);

      const result = service.getUser();

      expect(result).toBeUndefined();
    });
  });

  describe('getAdmin', () => {
    it('should return the first user with admin role', () => {
      mockDb.readData.mockReturnValue(mockUsers);

      const result = service.getAdmin();

      expect(result).toEqual(mockUsers[1]); // Jane Smith
      expect(result?.role).toBe('admin');
    });

    it('should return undefined if no users with admin role exist', () => {
      const onlyUsers = mockUsers.filter(user => user.role === 'user');
      mockDb.readData.mockReturnValue(onlyUsers);

      const result = service.getAdmin();

      expect(result).toBeUndefined();
    });

    it('should return undefined when no users exist', () => {
      mockDb.readData.mockReturnValue([]);

      const result = service.getAdmin();

      expect(result).toBeUndefined();
    });
  });
});
