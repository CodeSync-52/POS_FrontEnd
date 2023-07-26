export interface customerGroup {
  value: number;
  label: string;
}
export interface IOption<T = string | number> {
  label: string;
  value: T;
}

export type userManagementSearchFilter = {
  customerGroup: null | string | number;
  role: null | string | number;
  status: null | string | number;
};
