import {AssignmentBySchedule, AssignmentScheduleDetail, AttendanceTypeStr} from '../entities/Assignment';
import {AuthToken} from '../entities/AuthToken';
import {EmployeeAcl} from '../entities/EmployeeAcl';

export interface AuthRepository {
  login(username: string, password: string): Promise<AuthToken>;
  fetchEmployeeAcl(accessToken: string): Promise<EmployeeAcl>;
  fetchAssignmentsBySchedule(accessToken: string): Promise<AssignmentBySchedule[]>;
  fetchScheduleByAttendanceType(
    accessToken: string,
    attendanceType: AttendanceTypeStr,
  ): Promise<AssignmentScheduleDetail>;
  saveToken(token: AuthToken): Promise<void>;
  saveEmployeeAcl(acl: EmployeeAcl): Promise<void>;
  saveAssignments(assignments: AssignmentBySchedule[]): Promise<void>;
  saveTodayAssignment(assignment: AssignmentBySchedule): Promise<void>;
  saveTodayScheduleDetail(detail: AssignmentScheduleDetail): Promise<void>;
  getAccessToken(): Promise<string | null>;
  getEmployeeAcl(): Promise<EmployeeAcl | null>;
}
