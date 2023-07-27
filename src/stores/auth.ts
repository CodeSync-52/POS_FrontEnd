import { defineStore } from 'pinia';
// import { ref } from 'vue';
export const useAuthStore = defineStore('login', () => {
  // const loginCred = ref({
  //   email: '',
  //   password: '',
  // });

  const storingLoginCredentials = (email: string, password: string) => {
    console.log('email : ', email, 'and password : ', password);
  };
  return {
    // loginCred,
    storingLoginCredentials,
  };
});
