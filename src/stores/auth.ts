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
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('login', () => {
  const loggedInUser = ref<IUser | null>(null);
  const router = useRouter();
  function checkUserHasPermission(
    moduleId: EUserModules,
    permissionId: EActionPermissions
  ) {
    if (!loggedInUser.value) return false;
    if (loggedInUser.value.rolePermissions.roleName === EUserRoles.SuperAdmin) {
      return true;
    }
    console.log(loggedInUser.value.rolePermissions);
    const moduleIndex =
      loggedInUser.value.rolePermissions.permissionModuleActions.findIndex(
        (module) => module.moduleId === moduleId
      );
    if (moduleIndex < 0) {
      return false;
    }
    return (
      loggedInUser.value.rolePermissions.permissionModuleActions
        .map((action) => action.actionIds)
        .filter((y) => y.includes(permissionId)).length > 0
    );
  }

  async function loginUser(params: { userName: string; password: string }) {
    return await makeApiCall<IGenericResponse<IUser>>({
      url: 'api/Account/login',
      method: 'POST',
      data: params,
    }).then((res) => {
      console.log(res);
      if (res?.data) {
        loggedInUser.value = res.data;
      }
      return res;
    });
  }

  const logoutUser = () => {
    loggedInUser.value = null;
    router.push('/login');
  };
  return {
    loggedInUser,
    checkUserHasPermission,
    logoutUser,
    loginUser,
  };
});
