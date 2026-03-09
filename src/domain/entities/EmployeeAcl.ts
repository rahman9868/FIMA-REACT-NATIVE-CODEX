export type EmployeeAcl = {
  account?: {
    username?: string;
    name?: string;
    email?: string;
  };
  [key: string]: unknown;
};
