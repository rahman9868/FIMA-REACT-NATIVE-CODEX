export enum AttendanceTypeStr {
  Schedule = 'Schedule',
  Flexi = 'Flexi',
  FlexiTemp = 'FlexiTemp',
}

export type AssignmentBySchedule = {
  attendanceType: number;
  attendanceTypeStr: AttendanceTypeStr;
  id: number;
  scheduleId: number;
  workingDayCode: string;
  [key: string]: unknown;
};

export type AssignmentScheduleDetail = {
  data: Array<Record<string, unknown>>;
  [key: string]: unknown;
};
