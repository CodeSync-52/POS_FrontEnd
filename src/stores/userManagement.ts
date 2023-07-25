import { defineStore } from 'pinia';
import { ref } from 'vue';
export default defineStore('user-management', () => {
  const addingNewUser = ref({
    assignShop: '',
    customerGroup: '',
    isActive: true,
    isPhnNumberAsUserNumber: false,
    outStandingBalance: 0,
    password: '',
    phone: '',
    role: '',
    userName: '',
    wholeSaleDiscount: 0,
  });
  return {
    addingNewUser,
  };
});
