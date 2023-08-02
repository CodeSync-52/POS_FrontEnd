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
  const loggedInUser = ref<IUser | null>(null);

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
