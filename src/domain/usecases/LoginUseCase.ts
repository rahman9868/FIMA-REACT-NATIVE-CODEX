import {AuthToken} from '../entities/AuthToken';
import {EmployeeAcl} from '../entities/EmployeeAcl';
import {AuthRepository} from '../repositories/AuthRepository';

export type LoginResult = {
  token: AuthToken;
  acl: EmployeeAcl;
};

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(username: string, password: string): Promise<LoginResult> {
    if (!username.trim() || !password.trim()) {
      throw new Error('Username and password are required.');
    }

    const token = await this.authRepository.login(username, password);
    await this.authRepository.saveToken(token);

    const acl = await this.authRepository.fetchEmployeeAcl(token.accessToken);
    await this.authRepository.saveEmployeeAcl(acl);

    return {
      token,
      acl,
    };
  }
}
