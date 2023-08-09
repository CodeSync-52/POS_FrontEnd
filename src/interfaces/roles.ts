export interface IUserRole {
  action: string;
  id: number;
  name: string;
  roles: IUserRolePermissions[];
}

export interface IUserRolePermissions {
  moduleId: number;
  moduleName: string;
  actionIds: number[];
}
