import {useCallback, useState} from 'react';
import {API_CONFIG} from '../../core/config/apiConfig';
import {HttpClient} from '../../infra/network/HttpClient';
import {
  StoredAttendanceSummaryItem,
  StoredAttendanceEventType,
  TokenStorage,
} from '../../infra/storage/TokenStorage';

export type AttendanceEventType = StoredAttendanceEventType;

type AttendanceSummaryResponse = {
  data: StoredAttendanceSummaryItem[];
};

export type AttendanceSummaryCount = Record<AttendanceEventType, number>;

const EMPTY_SUMMARY: AttendanceSummaryCount = {
  LATE: 0,
  ON_TIME: 0,
  ABSENT: 0,
  PENDING: 0,
  WORKING: 0,
  BUSINESS: 0,
  HOLIDAY: 0,
  LEAVE: 0,
};

const tokenStorage = new TokenStorage();
const httpClient = new HttpClient(API_CONFIG.baseUrl);

const isOnOrBeforeToday = (year: number, month: number, day: number): boolean => {
  const today = new Date();
  const itemDate = new Date(year, month - 1, day);

  return itemDate <= today;
};

const resolveEmployeeId = (acl: Awaited<ReturnType<TokenStorage['getEmployeeAcl']>>): number => {
  const id =
    typeof acl?.id === 'number'
      ? acl.id
      : typeof acl?.account?.id === 'number'
        ? acl.account.id
        : null;

  if (id === null) {
    throw new Error('Employee ID not found in ACL');
  }

  return id;
};

const calculateSummary = (
  items: StoredAttendanceSummaryItem[],
): {summary: AttendanceSummaryCount; employeeName: string} => {
  const summary: AttendanceSummaryCount = {...EMPTY_SUMMARY};
  let employeeName = '';

  items.forEach(item => {
    if (!employeeName && item.employeeName) {
      employeeName = item.employeeName;
    }

    item.event.forEach(eventItem => {
      if (summary[eventItem.eventType] !== undefined) {
        summary[eventItem.eventType] += 1;
      }

      const includeInWorking =
        eventItem.eventType === 'ON_TIME' ||
        eventItem.eventType === 'LATE' ||
        eventItem.eventType === 'ABSENT' ||
        eventItem.eventType === 'PENDING' ||
        ((eventItem.eventType === 'BUSINESS' || eventItem.eventType === 'LEAVE') &&
          isOnOrBeforeToday(item.year, item.month, eventItem.day));

      if (includeInWorking) {
        summary.WORKING += 1;
      }
    });
  });

  return {summary, employeeName};
};

export const useDashboardViewModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [summary, setSummary] = useState<AttendanceSummaryCount>(EMPTY_SUMMARY);

  const applyAttendanceSummaryData = useCallback((items: StoredAttendanceSummaryItem[]) => {
    const result = calculateSummary(items);
    setSummary(result.summary);
    setEmployeeName(result.employeeName);
  }, []);

  const fetchAttendanceSummary = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [accessToken, acl] = await Promise.all([
        tokenStorage.getAccessToken(),
        tokenStorage.getEmployeeAcl(),
      ]);

      if (!accessToken) {
        throw new Error('Access token not found. Please login again.');
      }

      const employeeId = resolveEmployeeId(acl);
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const response = await httpClient.request<AttendanceSummaryResponse>(
        `${API_CONFIG.attendanceSummaryPath}/${employeeId}/${year}/${month}`,
        {
          method: 'GET',
          accessToken,
        },
      );

      const attendanceData = response.data ?? [];
      applyAttendanceSummaryData(attendanceData);
      await tokenStorage.saveAttendanceSummary(attendanceData);
    } catch (error) {
      const cachedAttendance = await tokenStorage.getAttendanceSummary();

      if (cachedAttendance && cachedAttendance.length > 0) {
        applyAttendanceSummaryData(cachedAttendance);
        setErrorMessage('Using saved attendance summary data.');
      } else {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to fetch attendance summary';
        setErrorMessage(message);
        setSummary(EMPTY_SUMMARY);
      }
    } finally {
      setIsLoading(false);
    }
  }, [applyAttendanceSummaryData]);

  return {
    isLoading,
    errorMessage,
    employeeName,
    summary,
    fetchAttendanceSummary,
  };
};
