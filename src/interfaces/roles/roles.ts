export interface IUserRole {
  action: string;
  id: number;
  name: string;
  roles: IUserRolePermissions[];
}

export interface IUserRolePermissions {
  create: boolean;
  delete: boolean;
  edit: boolean;
  id: number;
  role: string;
  view: boolean;
}
