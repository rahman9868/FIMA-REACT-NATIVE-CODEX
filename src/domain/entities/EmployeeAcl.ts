export type EmployeeAcl = {
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
