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
    const moduleIndex =
      loggedInUser.value.rolePermissions.permissionModuleActions.findIndex(
        (module) => module.moduleId === moduleId
      );
    if (moduleIndex < 0) {
      return false;
    }
    return loggedInUser.value.rolePermissions.permissionModuleActions[
      moduleIndex
    ].actionIds.includes(permissionId);
  }

  async function loginUser(params: { userName: string; password: string }) {
    const res = await makeApiCall<IGenericResponse<IUser>>({
      url: 'api/Account/login',
      method: 'POST',
      data: params,
    });
    loggedInUser.value = res.data;
    const role = loggedInUser.value.rolePermissions.roleName.toLowerCase();
    if (
      role === EUserRoles.ShopManager.toLowerCase() ||
      role === EUserRoles.ShopOfficer.toLowerCase()
    ) {
      router.push('/shop-sale');
    } else {
      router.push('/role');
    }
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
