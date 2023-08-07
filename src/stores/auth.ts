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
  const localStorageData = localStorage.getItem('storeData');

  const loggedInUser = ref<IUser | null>(
    localStorageData ? JSON.parse(localStorageData) : null
  );
  const router = useRouter();
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
    const res = await makeApiCall<IGenericResponse<IUser>>({
      url: 'api/Account/login',
      method: 'POST',
      data: params,
    });
    loggedInUser.value = res.data;
    router.push('/role');
    return res;
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
