import { defineStore } from 'pinia';
import {
  EActionPermissions,
  EUserModules,
  EUserRoles,
  IGenericResponse,
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
    console.log(loggedInUser.value.rolePermissions);
    const moduleIndex = loggedInUser.value.rolePermissions.modules.findIndex(
      (module) => module.moduleId === moduleId
    );
    if (moduleIndex < 0) {
      return false;
    }
    return loggedInUser.value.rolePermissions.modules[moduleIndex].actions
      .map((action) => action.actionId)
      .includes(permissionId);
  }

  async function loginUser(params: { userName: string; password: string }) {
    return await makeApiCall<IGenericResponse<IUser>>({
      url: 'api/Account/login',
      method: 'POST',
      data: params,
    }).then((res) => {
      loggedInUser.value = res.data;
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
