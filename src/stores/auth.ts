import { defineStore } from 'pinia';
import {
  EActionPermissions,
  EUserModules,
  EUserRoles,
  IUser,
} from 'src/interfaces';
import { ref } from 'vue';
export const useAuthStore = defineStore('login', () => {
  const loggedInUser = ref<IUser | null>({
    aspNetUserId: '0032611b-2592-49d7-b98f-9331709fa68f',
    fullName: 'Jhon',
    userId: 1,
    loginTokenResponseDTO: {
      access_Token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwMDMyNjExYi0yNTkyLTQ5ZDctYjk4Zi05MzMxNzA5ZmE2OGYiLCJ1bmlxdWVfbmFtZSI6IkZ1cnFhbloiLCJBc3BOZXQuSWRlbnRpdHkuU2VjdXJpdHlTdGFtcCI6IjE3YTAyYTZjLTY3OTUtNDUzNi04NjYzLTE2MzcyZTcxNTExZSIsInJvbGUiOiJBZG1pbiIsIkZ1bGxOYW1lIjoiRnVycWFuWiIsIm5iZiI6MTY5MDQ0NTYyNywiZXhwIjoxNjkwNDUyODI3LCJpYXQiOjE2OTA0NDU2MjcsImlzcyI6IioiLCJhdWQiOiI0MTRlMTkyN2EzODg0ZjY4YWJjNzlmNzI4MzgzN2ZkMSJ9.gvvEnsdUBpPxPPECTLGeYdIgiKxq3vL6Dj0SW1ug6Bs',
      access_Token_Expires_In: 7200,
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

  const storingLoginCredentials = (email: string, password: string) => {
    console.log('email : ', email, 'and password : ', password);
  };
  const logoutUser = () => {
    loggedInUser.value = null;
  };
  return {
    loggedInUser,
    storingLoginCredentials,
    checkUserHasPermission,
    logoutUser,
  };
});
