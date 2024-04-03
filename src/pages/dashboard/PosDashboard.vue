<template>
  <div class="text-lg text-center font-medium mb-10">Dashboard</div>
  <div class="flex gap-4 justify-center items-center flex-col md:flex-row">
    <q-btn
      unelevated
      color=""
      icon="category"
      class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
      label="Article Management"
      to="/article"
    />
    <q-btn
      unelevated
      icon="bar_chart"
      color=""
      class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
      label="Sale Management"
      to="/sale"
    />
    <q-btn
      unelevated
      color=""
      icon="receipt"
      class="rounded-[4px] h-2 bg-btn-primary hover:bg-btn-primary-hover"
      label="Receipt Management"
      to="/receipt"
    />
  </div>
</template>

<script setup lang="ts"></script>
