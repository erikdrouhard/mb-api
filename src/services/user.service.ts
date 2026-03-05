import { userRepository } from '../repositories/user.repository';
import { createJWT, hashPassword, comparePasswords } from '../modules/auth';
import { AuthError, ConflictError, ValidationError } from '../modules/errors';

const MIN_PASSWORD_LENGTH = 8;

export const userService = {
  async createUser(username: string, password: string) {
    if (!username || !password) {
      throw new ValidationError('Username and password are required');
    }

    const trimmedUsername = username.trim();
    if (trimmedUsername.length === 0) {
      throw new ValidationError('Username cannot be empty');
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new ValidationError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    try {
      const user = await userRepository.create({
        username: trimmedUsername,
        password: await hashPassword(password),
      });
      return createJWT(user);
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e && e.code === 'P2002') {
        throw new ConflictError('Username already exists');
      }
      throw e;
    }
  },

  async signIn(username: string, password: string) {
    if (!username || !password) {
      throw new ValidationError('Username and password are required');
    }

    const user = await userRepository.findByUsername(username.trim());
    if (!user) {
      throw new AuthError('Invalid username or password');
    }

    const isValid = await comparePasswords(password, user.password);
    if (!isValid) {
      throw new AuthError('Invalid username or password');
    }

    return createJWT(user);
  },
};
