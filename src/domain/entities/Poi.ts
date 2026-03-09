export type EmployeePoi = {
  id: number;
  isActive: boolean;
  poiId: number;
  poi: {
    active: string;
    description: string;
    id: number;
    latitude: number;
    longitude: number;
    radius: number;
    timezone: string;
  };
  [key: string]: unknown;
};
