import {API_CONFIG} from '../../core/config/apiConfig';
import {AuthToken} from '../../domain/entities/AuthToken';
import {EmployeeAcl} from '../../domain/entities/EmployeeAcl';
import {AuthRepository} from '../../domain/repositories/AuthRepository';
import {HttpClient} from '../../infra/network/HttpClient';
import {TokenStorage} from '../../infra/storage/TokenStorage';

type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

type EmployeeAclResponse = {
  id: number;
  status: string;
  attendanceType: string;
  employeeType: string;
  account: {
    id: number;
    username: string;
    name: string;
    email: string;
  };
};

export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly tokenStorage: TokenStorage,
  ) {}

  async login(username: string, password: string): Promise<AuthToken> {
    const body = new URLSearchParams({
      username,
      password,
      grant_type: 'password',
    }).toString();

    const response = await this.httpClient.request<LoginResponse>(
      API_CONFIG.loginPath,
      {
        method: 'POST',
        headers: {
          Authorization: API_CONFIG.basicAuthorization,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      },
    );

    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    };
  }

  async fetchEmployeeAcl(accessToken: string): Promise<EmployeeAcl> {
    const response = await this.httpClient.request<EmployeeAclResponse>(
      API_CONFIG.employeeAclPath,
      {
        method: 'GET',
        accessToken,
      },
    );

    return {
      id: response.id,
      status: response.status,
      attendanceType: response.attendanceType,
      employeeType: response.employeeType,
      account: response.account,
    };
  }

  async saveToken(token: AuthToken): Promise<void> {
    await this.tokenStorage.save(token);
  }

  async saveEmployeeAcl(acl: EmployeeAcl): Promise<void> {
    await this.tokenStorage.saveEmployeeAcl(acl);
  }

  async getAccessToken(): Promise<string | null> {
    return this.tokenStorage.getAccessToken();
  }
}
