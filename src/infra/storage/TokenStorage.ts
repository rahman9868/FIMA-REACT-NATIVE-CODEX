import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AssignmentBySchedule,
  AssignmentScheduleDetail,
} from '../../domain/entities/Assignment';
import {AuthToken} from '../../domain/entities/AuthToken';
import {EmployeeAcl} from '../../domain/entities/EmployeeAcl';

const STORAGE_KEY = 'fima_auth_token';
const ACL_STORAGE_KEY = 'fima_employee_acl';
const ASSIGNMENTS_STORAGE_KEY = 'fima_assignments';
const TODAY_ASSIGNMENT_STORAGE_KEY = 'fima_today_assignment';
const TODAY_SCHEDULE_DETAIL_STORAGE_KEY = 'fima_today_schedule_detail';

export class TokenStorage {
  async save(token: AuthToken): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(token));
  }

  async saveEmployeeAcl(acl: EmployeeAcl): Promise<void> {
    await AsyncStorage.setItem(ACL_STORAGE_KEY, JSON.stringify(acl));
  }

  async saveAssignments(assignments: AssignmentBySchedule[]): Promise<void> {
    await AsyncStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments));
  }

  async saveTodayAssignment(assignment: AssignmentBySchedule): Promise<void> {
    await AsyncStorage.setItem(
      TODAY_ASSIGNMENT_STORAGE_KEY,
      JSON.stringify(assignment),
    );
  }

  async saveTodayScheduleDetail(detail: AssignmentScheduleDetail): Promise<void> {
    await AsyncStorage.setItem(
      TODAY_SCHEDULE_DETAIL_STORAGE_KEY,
      JSON.stringify(detail),
    );
  }

  async getAccessToken(): Promise<string | null> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as AuthToken;
    return parsed.accessToken;
  }

  async getEmployeeAcl(): Promise<EmployeeAcl | null> {
    const raw = await AsyncStorage.getItem(ACL_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as EmployeeAcl;
  }
}
