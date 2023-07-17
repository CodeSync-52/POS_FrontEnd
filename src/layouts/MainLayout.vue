<template>
  <q-layout view="lHh Lpr lFf">
    <div class="lg:hidden sm:block"> 
      <q-header class="bg-gradient-to-r from-red-600 to-red-800" elevated>
        <q-toolbar>
          <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

          <q-toolbar-title> POS App </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
        <q-list class="bg-gradient-to-r from-red-600 to-red-800 gap-4 flex-nowrap flex flex-col max-h-[100vh] h-full overflow-y-scroll">
          <q-item-label class="flex w-full justify-end" header>
            <q-icon name="close" @click="toggleLeftDrawer" size="25px" />
          </q-item-label>

          <div  class="px-4" v-for="link in essentialLinks" :key="link.title">
            <router-link @click="toggleLeftDrawer"  :to="link.path">
              <div class="flex group  items-center gap-6 p-2 px-4 hover:bg-[#651c17] hover:text-white rounded-[11px]">
                <div>
                  <q-icon :name="link.icon" class="group-hover:text-white text-[#121111]" style="color: ;" size="25px" />
                </div>
                <div class="text-[0.9rem] group-hover:text-white text-[#121111]">
                  {{ link.title }}
                </div>
              </div>
            </router-link>
          </div>

        </q-list>
      </q-drawer>
    </div>
    <div class="sm:hidden lg:block"> 
      <q-header class="bg-gradient-to-r from-red-600 to-red-800" elevated>
        <q-toolbar> 
          <q-toolbar-title > POS App </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="leftDrawerOpen" bordered>
        <q-list class="bg-gradient-to-r from-red-600 to-red-800 gap-4 flex-nowrap flex flex-col max-h-[100vh] h-full overflow-y-scroll">
          <div class="flex justify-center p-3">
    <img class="max-w-full w-[5rem]" src="../assets/Images/Kit_Shoes.jpeg" alt="Image" />
  </div>

          <div  class="px-4" v-for="link in essentialLinks" :key="link.title">
            <router-link   :to="link.path">
              <div class="flex group  items-center gap-6 p-2 px-4 hover:bg-[#651c17] hover:text-white rounded-[11px]">
                <div>
                  <q-icon :name="link.icon" class="group-hover:text-white text-[#121111]" style="color: ;" size="25px" />
                </div>
                <div class="text-[0.9rem] group-hover:text-white text-[#121111]">
                  {{ link.title }}
                </div>
              </div>
            </router-link>
          </div>

        </q-list>
      </q-drawer>
    </div>


    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const essentialLinks = [
  {
    title: 'Dashboard',
    caption: 'quasar.dev',
    icon: 'dashboard',
    path: '/dashBoard',
  },
  {
    title: 'Bill Generation',
    caption: 'github.com/quasarframework',
    icon: 'receipt_long',
    path: '/bill-generation',
  },
  {
    title: 'Customers/Vendors',
    caption: 'github.com/quasarframework',
    icon: 'groups',
    path: '/customer',
  },
  {
    title: 'Category Managment',
    caption: 'github.com/quasarframework',
    icon: 'category',
    path: '/category',
  },
  {
    title: 'Customers Group',
    caption: 'chat.quasar.dev',
    icon: 'workspaces_filled',
    path: '/customer-group',
  },
  {
    title: 'Cash in/Cash out',
    caption: 'chat.quasar.dev',
    icon: 'currency_exchange',
    path: '/cashInOut',
  },
  {
    title: 'Discount Managment',
    caption: 'forum.quasar.dev',
    icon: 'discount',
    path: '/discount',
  },
  {
    title: 'Goods Receipt Notes',
    caption: 'forum.quasar.dev',
    icon: 'receipt',
    path: '/goods-receipt',
  },
  {
    title: 'Inventory Management',
    caption: 'forum.quasar.dev',
    icon: 'inventory',
    path: '/inventory',
  },
  {
    title: 'Product Managment',
    caption: '@quasarframework',
    icon: 'local_florist',
    path: '/product',
  },
  {
    title: 'Receipt Management',
    caption: '@QuasarFramework',
    icon: 'print',
    path: '/receipt',
  },
  {
    title: 'Sales Management',
    caption: 'Community Quasar projects',
    icon: 'receipt',
    path: '/sale',
  },
  {
    title: 'Shop Management',
    caption: 'forum.quasar.dev',
    icon: 'store',
    path: '/shop',
  },
  {
    title: 'Return Management',
    caption: 'chat.quasar.dev',
    icon: 'assignment_returned',
    path: '/return'
  },
  {
    title: 'Reports Management',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    path: '/report',
  },
  {
    title: 'Roles Managment',
    caption: '@quasarframework',
    icon: 'summarize',
    path: '/role',
  },
  {
    title: 'Variant Managment',
    caption: '@quasarframework',
    icon: 'palette',
    path: '/variant',
  },
];

const leftDrawerOpen = ref(true);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
