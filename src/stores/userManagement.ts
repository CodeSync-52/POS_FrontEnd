import { defineStore } from 'pinia';
import { ref } from 'vue';
export default defineStore('user-management', () => {
  const addingNewUser = ref({
    assignShop: '',
    customerGroup: '',
    isActive: true,
    isPhnNumberAsUserNumber: false,
    outStandingBalance: '',
    password: '',
    phone: '',
    role: '',
    userName: '',
    wholeSaleDiscount: '',
  });
  return {
    addingNewUser,
  };
});
