import {AuthToken} from '../entities/AuthToken';
import {EmployeeAcl} from '../entities/EmployeeAcl';

export interface AuthRepository {
  login(username: string, password: string): Promise<AuthToken>;
  fetchEmployeeAcl(accessToken: string): Promise<EmployeeAcl>;
  saveToken(token: AuthToken): Promise<void>;
  saveEmployeeAcl(acl: EmployeeAcl): Promise<void>;
  getAccessToken(): Promise<string | null>;
}
