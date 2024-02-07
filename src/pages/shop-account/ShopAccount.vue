<template>
  <div
    class="text-lg text-center row justify-between md:text-left font-medium mb-4"
  >
    <span>Transfer To Account</span>
  </div>
  <div class="row column items-center justify-center h-[75vh]">
    <q-btn
      unelevated
      color=""
      class="bg-btn-primary text-center p-2 text-lg text-signature w-[400px] hover:bg-btn-primary-hover"
      label="Transfer To Shop Account"
      icon-right="east"
      @click="router.push('/shop-account/transfer-to-shop-account')"
    />
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
</script>
