import {
  AssignmentBySchedule,
  AssignmentScheduleDetail,
  AttendanceTypeStr,
} from '../entities/Assignment';
import {AuthToken} from '../entities/AuthToken';
import {EmployeeAcl} from '../entities/EmployeeAcl';
import {AuthRepository} from '../repositories/AuthRepository';

export type LoginResult = {
  token: AuthToken;
  acl: EmployeeAcl;
  assignments: AssignmentBySchedule[];
  todayAssignment: AssignmentBySchedule;
  todayScheduleDetail: AssignmentScheduleDetail;
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

    return {
      token,
      acl,
      assignments,
      todayAssignment,
      todayScheduleDetail,
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
}

export {AttendanceTypeStr};
