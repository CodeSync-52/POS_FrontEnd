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

export const GetUserRoleDetail = async (
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

export const updateUserRoles = async ({
  data,
  roleName,
}: {
  data: IUserRolePermissions[];
  roleName: EUserRoles;
}) => {
  return await makeApiCall({
    url: 'api/RolePermission/save',
    method: 'POST',
    params: { roleName },
    data,
  });
};
