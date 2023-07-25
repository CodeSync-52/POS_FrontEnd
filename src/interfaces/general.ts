export interface customerGroup {
  value: number;
  label: string;
}
export interface role {
  label?: string;
  value?: string;
}

export interface status {
  label?: string;
  value?: string;
}
export interface assignShop {
  label?: string;
  value?: string;
}

export type userManagementSearchFilter = {
  customerGroup: null | string | number;
  role: null | string | number;
  status: null | string | number;
};
