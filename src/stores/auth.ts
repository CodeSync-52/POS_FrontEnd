import { defineStore } from 'pinia';
import {
  EActionPermissions,
  EUserModules,
  EUserRoles,
  ILoginResponse,
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
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwMDMyNjExYi0yNTkyLTQ5ZDctYjk4Zi05MzMxNzA5ZmE2OGYiLCJ1bmlxdWVfbmFtZSI6IkZ1cnFhbloiLCJyb2xlIjoiQWRtaW4iLCJGdWxsTmFtZSI6IkZ1cnFhbloiLCJuYmYiOjE2OTA5NjIzMjQsImV4cCI6MTY5MDk2OTUyNCwiaWF0IjoxNjkwOTYyMzI0fQ.l5V3LZj_G5ZLLVEIJAYxFBlONTDFzS5lavz0KXPN40U',
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
      roleId: '39709840-76e6-4c61-9455-8571f6f65b1b',
      roleName: EUserRoles.SuperAdmin,
      permissionModuleActions: [
        {
          module: {
            moduleId: 1,
            moduleName: 'User Management',
            moduleGroup: 'Users',
          },
          actions: [
            {
              actionId: 1,
              actionName: 'View',
            },
            {
              actionId: 2,
              actionName: 'Create',
            },
          ],
        },
        {
          module: {
            moduleId: 2,
            moduleName: 'Role Managment',
            moduleGroup: 'Users',
          },
          actions: [],
        },
        {
          module: {
            moduleId: 3,
            moduleName: 'Customer Group Management',
            moduleGroup: 'Users',
          },
          actions: [],
        },
        {
          module: {
            moduleId: 4,
            moduleName: 'Variant Management',
            moduleGroup: 'Products',
          },
          actions: [],
        },
        {
          module: {
            moduleId: 5,
            moduleName: 'Category/Sub-Category Management',
            moduleGroup: 'Products',
          },
          actions: [],
        },
        {
          module: {
            moduleId: 6,
            moduleName: 'Article Management',
            moduleGroup: 'Products',
          },
          actions: [],
        },
        {
          module: {
            moduleId: 7,
            moduleName: 'Receipt Management',
            moduleGroup: 'Finance',
          },
          actions: [],
        },
        {
          module: {
            moduleId: 8,
            moduleName: 'Bill Generation',
            moduleGroup: 'Finance',
          },
          actions: [],
        },
        {
          module: {
            moduleId: 9,
            moduleName: 'Cash in/Cash Out Management',
            moduleGroup: 'Finance',
          },
          actions: [],
        },
        {
          module: {
            moduleId: 10,
            moduleName: 'Sales Management',
            moduleGroup: 'Sales',
          },
          actions: [],
        },
        {
          module: {
            moduleId: 11,
            moduleName: 'Inventory Management',
            moduleGroup: 'Sales',
          },
          actions: [],
        },
        {
          module: {
            moduleId: 12,
            moduleName: 'Shop Management',
            moduleGroup: 'Sales',
          },
          actions: [],
        },
        {
          module: {
            moduleId: 13,
            moduleName: 'Goods Receipt Notes (GRN) Module',
            moduleGroup: 'Stock',
          },
          actions: [],
        },
        {
          module: {
            moduleId: 14,
            moduleName: 'Stock Transfer Requests (STR) Module',
            moduleGroup: 'Stock',
          },
          actions: [],
        },
        {
          module: {
            moduleId: 15,
            moduleName: 'Sale and Return Management Module - Shop',
            moduleGroup: 'Sales',
          },
          actions: [],
        },
        {
          module: {
            moduleId: 16,
            moduleName: 'Shop Discounts Module',
            moduleGroup: 'Sales',
          },
          actions: [],
        },
        {
          module: {
            moduleId: 17,
            moduleName: 'Reports',
            moduleGroup: 'Reports',
          },
          actions: [],
        },
      ],
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
    return await makeApiCall<ILoginResponse>({
      url: 'api/Account/login',
      method: 'POST',
      data: params,
    }).then((res) => {
      loggedInUser.value = res.data;
      return res.data;
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
