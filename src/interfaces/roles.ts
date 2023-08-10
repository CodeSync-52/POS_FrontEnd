import { EActionPermissions, EUserModules } from './general';

export interface IUserRole {
  id: number;
  name: string;
  permissionModuleActions: IUserRolePermissions[];
}

export interface IUserRolePermissions {
  moduleId: EUserModules;
  moduleName: string;
  actionIds: EActionPermissions[];
}
