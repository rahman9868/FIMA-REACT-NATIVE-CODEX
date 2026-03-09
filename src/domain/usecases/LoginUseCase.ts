import {
  AssignmentBySchedule,
  AssignmentScheduleDetail,
  AttendanceTypeStr,
} from '../entities/Assignment';
import {AuthToken} from '../entities/AuthToken';
import {EmployeeAcl} from '../entities/EmployeeAcl';
import {FiraConfig} from '../entities/FiraConfig';
import {EmployeePoi} from '../entities/Poi';
import {AuthRepository} from '../repositories/AuthRepository';

export type LoginResult = {
  token: AuthToken;
  acl: EmployeeAcl;
  assignments: AssignmentBySchedule[];
  todayAssignment: AssignmentBySchedule;
  todayScheduleDetail: AssignmentScheduleDetail;
  pois: EmployeePoi[];
  configs: FiraConfig[];
};

const dayNames = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

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

    const assignments = await this.authRepository.fetchAssignmentsBySchedule(
      token.accessToken,
    );

    if (assignments.length === 0) {
      throw new Error('No assignment found for employee.');
    }

    await this.authRepository.saveAssignments(assignments);

    const todayAssignment = this.resolveTodayAssignment(assignments);
    await this.authRepository.saveTodayAssignment(todayAssignment);

    const todayScheduleDetail =
      await this.authRepository.fetchScheduleByAttendanceType(
        token.accessToken,
        todayAssignment.attendanceTypeStr,
      );
    await this.authRepository.saveTodayScheduleDetail(todayScheduleDetail);

    const employeeId = this.resolveEmployeeId(acl);
    const pois = await this.authRepository.fetchEmployeePois(
      token.accessToken,
      employeeId,
    );
    await this.authRepository.saveEmployeePois(pois);

    const configs = await this.authRepository.fetchFiraConfig(token.accessToken);
    await this.authRepository.saveFiraConfigs(configs);

    return {
      token,
      acl,
      assignments,
      todayAssignment,
      todayScheduleDetail,
      pois,
      configs,
    };
  }

  private resolveTodayAssignment(
    assignments: AssignmentBySchedule[],
  ): AssignmentBySchedule {
    const today = dayNames[new Date().getDay()];

    const matched = assignments.find(
      assignment =>
        assignment.workingDayCode.toUpperCase() === today ||
        assignment.workingDayCode.slice(0, 3).toUpperCase() === today.slice(0, 3),
    );

    return matched ?? assignments[0];
  }

  private resolveEmployeeId(acl: EmployeeAcl): number {
    const employeeId =
      typeof acl.id === 'number'
        ? acl.id
        : typeof acl.account?.id === 'number'
          ? acl.account.id
          : null;

    if (employeeId === null) {
      throw new Error('Employee ID not found in ACL response.');
    }

    return employeeId;
  }
}

export {AttendanceTypeStr};
