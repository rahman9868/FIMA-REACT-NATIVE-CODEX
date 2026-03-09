import {
  AssignmentBySchedule,
  AssignmentScheduleDetail,
  AttendanceTypeStr,
} from '../entities/Assignment';
import {AuthToken} from '../entities/AuthToken';
import {EmployeeAcl} from '../entities/EmployeeAcl';
import {FiraConfig} from '../entities/FiraConfig';
import {EmployeePoi} from '../entities/Poi';

export interface AuthRepository {
  login(username: string, password: string): Promise<AuthToken>;
  fetchEmployeeAcl(accessToken: string): Promise<EmployeeAcl>;
  fetchAssignmentsBySchedule(accessToken: string): Promise<AssignmentBySchedule[]>;
  fetchScheduleByAttendanceType(
    accessToken: string,
    attendanceType: AttendanceTypeStr,
  ): Promise<AssignmentScheduleDetail>;
  fetchEmployeePois(accessToken: string, employeeId: number): Promise<EmployeePoi[]>;
  fetchFiraConfig(accessToken: string): Promise<FiraConfig[]>;
  saveToken(token: AuthToken): Promise<void>;
  saveEmployeeAcl(acl: EmployeeAcl): Promise<void>;
  saveAssignments(assignments: AssignmentBySchedule[]): Promise<void>;
  saveTodayAssignment(assignment: AssignmentBySchedule): Promise<void>;
  saveTodayScheduleDetail(detail: AssignmentScheduleDetail): Promise<void>;
  saveEmployeePois(pois: EmployeePoi[]): Promise<void>;
  saveFiraConfigs(configs: FiraConfig[]): Promise<void>;
  getAccessToken(): Promise<string | null>;
  getEmployeeAcl(): Promise<EmployeeAcl | null>;
}
