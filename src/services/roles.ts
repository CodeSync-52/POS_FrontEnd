import {
  EUserRoles,
  IGenericResponse,
  IUserRolePermissions,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';

export interface IUserRoleResponse {
  roleName: EUserRoles;
  permissionModuleActions: IUserRolePermissions[];
}

export const fetchUserRoles = async (
  roleName: EUserRoles,
  controller: AbortController
) => {
  return await makeApiCall<IGenericResponse<IUserRoleResponse>>({
    url: 'api/RolePermission/detail',
    params: {
      roleName,
    },
    signal: controller.signal,
  });
};
