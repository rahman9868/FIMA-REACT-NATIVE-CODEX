import {AuthToken} from '../entities/AuthToken';

export interface AuthRepository {
  login(username: string, password: string): Promise<AuthToken>;
  saveToken(token: AuthToken): Promise<void>;
  getAccessToken(): Promise<string | null>;
}
