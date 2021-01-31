import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('Jwt Strategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('validate access token', () => {
    it('validates token and returns the user based on Jwt payload', async () => {
      const user = new User();
      user.username = 'tester@email.com';

      userRepository.findOne.mockResolvedValue(user);
      const result = await jwtStrategy.validate({
        username: 'tester@email.com',
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: 'tester@email.com',
      });
      expect(result).toEqual(user);
    });

    it('throws an unauthorized exception as user can not be found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(
        jwtStrategy.validate({ username: 'tester@email.com' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
