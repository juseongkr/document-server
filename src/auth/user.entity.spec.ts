import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('User entity test', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.username = 'tester@email.com';
    user.password = '1234qwer';
    user.salt = 'salt1234';
    bcrypt.hash = jest.fn();
  });

  describe('validate password', () => {
    it('returns true as password is valid', async () => {
      bcrypt.hash.mockReturnValue('1234qwer');
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const result = await user.validatePassword('qwer1234');
      expect(bcrypt.hash).toHaveBeenCalledWith('qwer1234', 'salt1234');
      expect(result).toEqual(true);
    });

    it('returns false as password is invalid', async () => {
      bcrypt.hash.mockReturnValue('invalidPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const result = await user.validatePassword('invalidPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('invalidPassword', 'salt1234');
      expect(result).toEqual(false);
    });
  });
});
