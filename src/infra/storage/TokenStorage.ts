import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AssignmentBySchedule,
  AssignmentScheduleDetail,
} from '../../domain/entities/Assignment';
import {AuthToken} from '../../domain/entities/AuthToken';
import {EmployeeAcl} from '../../domain/entities/EmployeeAcl';
import {FiraConfig} from '../../domain/entities/FiraConfig';
import {EmployeePoi} from '../../domain/entities/Poi';

export type StoredAttendanceEventType =
  | 'LATE'
  | 'ON_TIME'
  | 'ABSENT'
  | 'PENDING'
  | 'WORKING'
  | 'BUSINESS'
  | 'HOLIDAY'
  | 'LEAVE';

export type StoredAttendanceSummaryEvent = {
  day: number;
  eventType: StoredAttendanceEventType;
};

export type StoredAttendanceSummaryItem = {
  employeeId: number;
  employeeName: string;
  event: StoredAttendanceSummaryEvent[];
  month: number;
  year: number;
};

const STORAGE_KEY = 'fima_auth_token';
const ACL_STORAGE_KEY = 'fima_employee_acl';
const ASSIGNMENTS_STORAGE_KEY = 'fima_assignments';
const TODAY_ASSIGNMENT_STORAGE_KEY = 'fima_today_assignment';
const TODAY_SCHEDULE_DETAIL_STORAGE_KEY = 'fima_today_schedule_detail';
const POI_STORAGE_KEY = 'fima_poi_of_employee';
const FIRA_CONFIG_STORAGE_KEY = 'fima_fira_config';
const ATTENDANCE_SUMMARY_STORAGE_KEY = 'fima_attendance_summary';

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

  async saveEmployeePois(pois: EmployeePoi[]): Promise<void> {
    await AsyncStorage.setItem(POI_STORAGE_KEY, JSON.stringify(pois));
  }

  async saveFiraConfigs(configs: FiraConfig[]): Promise<void> {
    await AsyncStorage.setItem(FIRA_CONFIG_STORAGE_KEY, JSON.stringify(configs));
  }

  async saveAttendanceSummary(summary: StoredAttendanceSummaryItem[]): Promise<void> {
    await AsyncStorage.setItem(
      ATTENDANCE_SUMMARY_STORAGE_KEY,
      JSON.stringify(summary),
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

  async getAttendanceSummary(): Promise<StoredAttendanceSummaryItem[] | null> {
    const raw = await AsyncStorage.getItem(ATTENDANCE_SUMMARY_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as StoredAttendanceSummaryItem[];
  }
}

