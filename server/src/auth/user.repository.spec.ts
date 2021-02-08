import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

const mockCredentialDto = {
  username: 'tester@email.com',
  password: '1234qwer',
};

describe('User Repository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('user sign up', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('authorized user sign up', () => {
      save.mockResolvedValue(undefined);
      expect(userRepository.signUp(mockCredentialDto)).resolves.not.toThrow();
    });

    it('throws a conflict exception as username already exists', () => {
      save.mockRejectedValue({ code: 'ER_DUP_ENTRY' });
      expect(userRepository.signUp(mockCredentialDto)).resolves.toThrow(
        ConflictException,
      );
    });

    it('throws a internal exception', () => {
      save.mockRejectedValue({ code: 'NOT_CATCHED' });
      expect(userRepository.signUp(mockCredentialDto)).resolves.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('Validate password', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new User();
      (user.username = 'tester@email.com'), (user.validatePassword = jest.fn());
    });

    it('returns the username as validation is successful', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);

      const result = await userRepository.validatePassword(mockCredentialDto);
      expect(result).toEqual('tester@email.com');
    });

    it('returns null as user can not be found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.validatePassword(mockCredentialDto);
      expect(result).toBeNull();
    });

    it('returns null as password is invalid', async () => {
      userRepository.findOne.mockResolvedValue(null);
      user.validatePassword.mockResolvedValue(false);

      const result = await userRepository.validatePassword(mockCredentialDto);
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('Hash password', () => {
    it('bcrypt.hash to generate a hash string', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('hashstring');
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const result = await userRepository.hashPassword('1234qwer', 'salt1234');
      expect(bcrypt.hash).toHaveBeenCalledWith('1234qwer', 'salt1234');
      expect(result).toEqual('hashstring');
    });
  });
});
