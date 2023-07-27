import { defineStore } from 'pinia';
import { IUserData } from 'src/interfaces/user-management';
import { ref } from 'vue';
export const useUserManagementStore = defineStore('user-management', () => {
  const currentUserData = ref<IUserData>({
    isActive: true,
    isPhnNumberAsUserNumber: false,
    outStandingBalance: 0,
    password: '',
    phone: '',
    userName: '',
    wholeSaleDiscount: 0,
    fullName: '',
  });

  const addNewUser = (userData: IUserData) => {
    console.log('Adding new user', userData);
  };
  return {
    currentUserData,
    addNewUser,
  };
});
