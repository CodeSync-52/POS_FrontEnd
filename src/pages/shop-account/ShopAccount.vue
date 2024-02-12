<template>
  <div
    class="flex md:flex-row md:gap-0 md:justify-between sm:justify-start sm:flex-col sm:gap-4 md:items-center sm:items-center mb-4"
  >
    <span class="text-xl font-medium">Shop Account</span>
    <router-link to="/shop-account/transfer-to-shop-account">
      <q-btn
        unelevated
        label="Transfer To Shop Account"
        class="rounded-[4px] bg-btn-primary hover:bg-btn-primary-hover"
        color=""
      />
    </router-link>
  </div>
</template>
<script setup lang="ts"></script>
