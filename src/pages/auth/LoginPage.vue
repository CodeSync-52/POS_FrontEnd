<template>
  <div
    class="grid items-center grid-cols-1 lg:grid-cols-[5fr_4fr] bg-[url('/src/assets/Images/loginBg.jpg')] h-screen"
  >
    <div class="hidden lg:!inline-block"></div>
    <div
      class="flex flex-col min-w-[320px] w-full max-w-[400px] mx-auto justify-center q-pa-md"
    >
      <div class="bg-white px-6 py-8 rounded-md q-gutter-y-md">
        <div class="w-12 mx-auto">
          <img src="/assets/Pos-icon.png" alt="logo" />
        </div>
        <h3 class="text-3xl text-center mb-8 font-medium">Welcome to POS</h3>
        <q-input label="Username" dense outlined />
        <q-input label="Password" dense outlined />
        <div class="mb-10 text-subtitle2 text-signature flex justify-end">
          <span class="cursor-pointer hover:text-blue-400"
            >Forgot Password?</span
          >
        </div>
        <button
          class="bg-blue-600 text-white rounded-lg py-3 w-full hover:bg-blue-500"
        >
          Login
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>
