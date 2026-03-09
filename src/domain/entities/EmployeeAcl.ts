export type EmployeeAcl = {
  id?: number;
  account?: {
    id?: number;
    username?: string;
    name?: string;
    email?: string;
  };
  [key: string]: unknown;
};
