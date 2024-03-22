<template>
  <div
    class="row column items-center justify-center h-[calc(100vh-115px)] gap-4"
  >
    <div class="max-w-[120px] md:max-w-[160px] mx-auto">
      <img
        src="public/assets/accessdenied.png.webp"
        alt="POS Icon"
        class="text-signature"
      />
    </div>
    <div class="max-w-[500px] text-center">
      <h2 class="font-semibold text-xl md:text-3xl mb-3">Access denied!</h2>
      <p class="font-medium text-base md:text-lg">
        You do not have proper authorization to access this resource. Please
        contact the administrator for assistance.
      </p>
    </div>
    <q-btn
      unelevated
      color=""
      class="rounded-[4px] h-2 border bg-btn-primary hover:bg-btn-primary-hover"
      icon="keyboard_return"
      label="Go Back"
      @click="$router.go(-1)"
    />
  </div>
</template>

<script setup lang="ts"></script>
