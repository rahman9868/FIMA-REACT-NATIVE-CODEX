import {AuthToken} from '../entities/AuthToken';
import {AuthRepository} from '../repositories/AuthRepository';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(username: string, password: string): Promise<AuthToken> {
    if (!username.trim() || !password.trim()) {
      throw new Error('Username and password are required.');
    }

    const token = await this.authRepository.login(username, password);
    await this.authRepository.saveToken(token);

    return token;
  }
}
