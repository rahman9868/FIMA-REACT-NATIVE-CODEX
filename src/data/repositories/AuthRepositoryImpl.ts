import {API_CONFIG} from '../../core/config/apiConfig';
import {
  AssignmentBySchedule,
  AssignmentScheduleDetail,
  AttendanceTypeStr,
} from '../../domain/entities/Assignment';
import {AuthToken} from '../../domain/entities/AuthToken';
import {EmployeeAcl} from '../../domain/entities/EmployeeAcl';
import {AuthRepository} from '../../domain/repositories/AuthRepository';
import {HttpClient} from '../../infra/network/HttpClient';
import {TokenStorage} from '../../infra/storage/TokenStorage';

type LoginResponse = {
  access_token: string;
  refresh_token: string;
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
    return this.httpClient.request<EmployeeAcl>(API_CONFIG.employeeAclPath, {
      method: 'GET',
      accessToken,
    });
  }

  async fetchAssignmentsBySchedule(
    accessToken: string,
  ): Promise<AssignmentBySchedule[]> {
    return this.httpClient.request<AssignmentBySchedule[]>(
      API_CONFIG.assignmentsBySchedulePath,
      {
        method: 'GET',
        accessToken,
      },
    );
  }

  async fetchScheduleByAttendanceType(
    accessToken: string,
    attendanceType: AttendanceTypeStr,
  ): Promise<AssignmentScheduleDetail> {
    const path =
      attendanceType === AttendanceTypeStr.Schedule
        ? API_CONFIG.scheduleEmployeePath
        : attendanceType === AttendanceTypeStr.Flexi
          ? API_CONFIG.scheduleFlexibleEmployeePath
          : API_CONFIG.scheduleFlexibleTempEmployeePath;

    return this.httpClient.request<AssignmentScheduleDetail>(path, {
      method: 'GET',
      accessToken,
    });
  }

  async saveToken(token: AuthToken): Promise<void> {
    await this.tokenStorage.save(token);
  }

  async saveEmployeeAcl(acl: EmployeeAcl): Promise<void> {
    await this.tokenStorage.saveEmployeeAcl(acl);
  }

  async saveAssignments(assignments: AssignmentBySchedule[]): Promise<void> {
    await this.tokenStorage.saveAssignments(assignments);
  }

  async saveTodayAssignment(assignment: AssignmentBySchedule): Promise<void> {
    await this.tokenStorage.saveTodayAssignment(assignment);
  }

  async saveTodayScheduleDetail(detail: AssignmentScheduleDetail): Promise<void> {
    await this.tokenStorage.saveTodayScheduleDetail(detail);
  }

  async getAccessToken(): Promise<string | null> {
    return this.tokenStorage.getAccessToken();
  }

  async getEmployeeAcl(): Promise<EmployeeAcl | null> {
    return this.tokenStorage.getEmployeeAcl();
  }
}
