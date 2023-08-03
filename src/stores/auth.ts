import { defineStore } from 'pinia';
import {
  EActionPermissions,
  EUserModules,
  EUserRoles,
  IUser,
} from 'src/interfaces';
import { makeApiCall } from 'src/utils';
import { ref } from 'vue';
export const useAuthStore = defineStore('login', () => {
  const loggedInUser = ref<IUser | null>({
    aspNetUserId: '0032611b-2592-49d7-b98f-9331709fa68f',
    fullName: 'Jhon',
    userId: 1,
    loginTokenResponseDTO: {
      access_Token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwMDMyNjExYi0yNTkyLTQ5ZDctYjk4Zi05MzMxNzA5ZmE2OGYiLCJ1bmlxdWVfbmFtZSI6IkZ1cnFhbloiLCJyb2xlIjoiQWRtaW4iLCJGdWxsTmFtZSI6IkZ1cnFhbloiLCJuYmYiOjE2OTEwOTUyNzMsImV4cCI6MTY5MTEwMjQ3MywiaWF0IjoxNjkxMDk1MjczfQ.0KtxW9W0iSL2Z1G5ghh5rk7gM0gCgU-CMDnBvm3gXJg',
      access_Token_Expires_In: 0,
      token_Type: 'bearer',
      userId: '0032611b-2592-49d7-b98f-9331709fa68f',
      refresh_Token: null,
      refresh_Token_Expires_In: 0,
      error: null,
      error_Description: null,
      message: null,
    },
    rolePermissions: {
      permissionModuleActions: [],
      roleId: '',
      roleName: EUserRoles.SuperAdmin,
    },
  });

  function checkUserHasPermission(
    moduleId: EUserModules,
    permissionId: EActionPermissions
  ) {
    if (!loggedInUser.value) return false;
    if (loggedInUser.value.rolePermissions.roleName === EUserRoles.SuperAdmin) {
      return true;
    }
    const moduleIndex =
      loggedInUser.value.rolePermissions.permissionModuleActions.findIndex(
        (module) => module.module.moduleId === moduleId
      );
    if (moduleIndex < 0) {
      return false;
    }
    return loggedInUser.value.rolePermissions.permissionModuleActions[
      moduleIndex
    ].actions
      .map((action) => action.actionId)
      .includes(permissionId);
  }

  async function loginUser(params: { userName: string; password: string }) {
    return await makeApiCall<IUser>({
      url: 'api/Account/login',
      method: 'POST',
      data: params,
    }).then((res) => {
      loggedInUser.value = res;
      return res;
    });
  }

  const logoutUser = () => {
    loggedInUser.value = null;
  };
  return {
    loggedInUser,
    checkUserHasPermission,
    logoutUser,
    loginUser,
  };
});
