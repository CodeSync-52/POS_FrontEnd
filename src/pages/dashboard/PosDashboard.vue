<template>
  <div class="text-lg text-center font-medium mb-10">Dashboard</div>
  <div class="flex gap-4 justify-center items-center flex-col md:flex-row">
    <q-btn
      unelevated
      color=""
      icon="receipt"
      class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
      label="Stock Receive"
      to="/receipt"
    />

    <q-btn
      unelevated
      color=""
      icon="category"
      class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
      label="Article"
      to="/article"
    />
    <q-btn
      unelevated
      icon="bar_chart"
      color=""
      class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
      label="Sale From HO"
      to="/sale"
    />

    <q-btn
      unelevated
      color=""
      v-if="
        authStore.loggedInUser?.rolePermissions.roleName ===
        EUserRoles.SuperAdmin.toLowerCase()
      "
      icon="attach_money"
      class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
      label="Expense"
      to="/expenses"
    />

    <q-btn
      unelevated
      icon="inventory"
      color=""
      class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
      label="Inventory (GRN)"
      to="/inventory"
    />

    <q-btn
      unelevated
      icon="local_shipping"
      color=""
      class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
      label="STR"
      to="/goods-receipt"
    />

    <q-btn
      v-if="
        authStore.loggedInUser?.rolePermissions.roleName ===
        EUserRoles.SuperAdmin.toLowerCase()
      "
      unelevated
      icon="settings"
      color=""
      class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
      label="Settings"
      to="/setting"
    />
  </div>
</template>

<script setup lang="ts">
import { EUserRoles } from 'src/interfaces';
import { useAuthStore } from 'src/stores';

const authStore = useAuthStore();
</script>
