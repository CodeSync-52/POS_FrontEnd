<template>
  <q-layout view="lHh Lpr lFf">
    <div class="">
      <q-header class="bg-gradient-to-r from-blue-600 to-blue-800" elevated>
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          />
          <q-toolbar-title> POS App </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
        <q-list
          class="bg-gradient-to-r from-blue-600 to-blue-800 gap-4 flex-nowrap flex flex-col max-h-[100vh] h-full overflow-y-scroll mainlayoutSidebar"
        >
          <q-item-label class="flex w-full justify-end" header>
            <q-icon
              name="close"
              flat
              dense
              round
              @click="toggleLeftDrawer"
              size="25px"
              class="lg:hidden"
            />
          </q-item-label>
          <div class="w-16 mx-auto">
            <img :src="PosIcon" alt="POS Icon" class="text-white" />
          </div>

          <div v-for="link in essentialLinks" :key="link.title">
            <q-expansion-item
              group="somegroup"
              expand-icon-class="text-white"
              :icon="link.icon"
              :label="link.title"
              header-class="text-white"
            >
              <q-card class="bg-gradient-to-r from-blue-600 to-blue-800">
                <q-card-section class="q-py-none q-pl-lg">
                  <router-link
                    v-for="subLinks in link?.children"
                    :key="subLinks.title"
                    :to="subLinks.path"
                    class="pl-7"
                  >
                    <div
                      class="text-[0.9rem] pl-2 py-2 text-white hover:bg-[#6097EA] rounded-md cursor-pointer"
                    >
                      {{ subLinks.title }}
                    </div>
                  </router-link>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
        </q-list>
      </q-drawer>
    </div>
    <q-page-container>
      <div class="p-4">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PosIcon from '../assets/Images/Pos-icon.png';
const essentialLinks = [
  {
    title: 'User Management',
    icon: 'dashboard',
    children: [
      {
        title: 'User Management',
        path: '/user',
      },
      {
        title: 'Role/Permission Management',
        path: '/role',
      },
      {
        title: 'Customer Group Management',
        path: '/customer-group',
      },
    ],
  },
  {
    title: 'Sales Operations',
    icon: 'receipt',
    children: [
      {
        title: 'Receipt Management',
        path: '/receipt',
      },
      {
        title: 'Bill Generation',
        path: '/bill-generation',
      },
      {
        title: 'Cash in/Cash out',
        path: '/cashInOut',
      },
      {
        title: 'Sales Management',
        path: '/sale',
      },
      {
        title: 'Sales Return Management',
        path: '/return',
      },
      {
        title: 'Shop Discounts',
        path: '/discount',
      },
    ],
  },
  {
    title: 'Product Management',
    caption: 'quasar.dev',
    icon: 'local_florist',
    children: [
      {
        title: 'Variant Management',
        path: '/variant',
      },
      {
        title: 'Category Management',
        path: '/category',
      },
      {
        title: 'Article Management',
        path: '/article',
      },
      {
        title: 'Inventory Management',
        path: '/inventory',
      },
    ],
  },
  {
    title: 'Shop Management',
    caption: 'quasar.dev',
    icon: 'store',
    children: [
      {
        title: 'Shop Management',
        path: '/shop',
      },
      {
        title: 'Good Receipt Notes (GRN)',
        path: '/goods-receipt',
      },
      {
        title: 'Stock Transfer Requests (STR)',
        path: '/stock-transfer',
      },
    ],
  },
  {
    title: 'Reporting and Analytics',
    caption: 'quasar.dev',
    icon: 'chat',
    children: [
      {
        title: 'Report Management',
        caption: 'quasar.dev',
        path: '/report',
      },
    ],
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
