<template>
  <q-layout view="lHh Lpr lFf">
    <div class="">
      <q-header class="bg-signature" elevated>
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          />
          <q-toolbar-title>Point of Sale</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
        <q-list
          class="bg-signature gap-4 flex-nowrap flex flex-col max-h-[100vh] h-full overflow-y-scroll mainlayoutSidebar"
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
            <img src="/assets/Pos-icon.png" alt="POS Icon" class="text-white" />
          </div>

          <div v-for="link in allowedLinks" :key="link.title">
            <q-expansion-item
              group="somegroup"
              expand-icon-class="text-white"
              :icon="link.icon"
              :label="link.title"
              header-class="text-white"
            >
              <q-card class="bg-signature">
                <q-card-section class="q-py-none q-pl-lg">
                  <router-link
                    v-for="subLinks in link?.children"
                    :key="subLinks.title"
                    :to="subLinks.path"
                    class="pl-7"
                  >
                    <div
                      class="text-[0.9rem] pl-2 py-2 text-white transition-all hover:bg-[#2599f5] rounded-md cursor-pointer"
                    >
                      {{ getRoleModuleDisplayName(subLinks.title) }}
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
import {
  EActionPermissions,
  EUserModules,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { useAuthStore } from 'src/stores';
import { computed, ref } from 'vue';
const authStore = useAuthStore();
const essentialLinks = [
  {
    title: 'User Management',
    icon: 'dashboard',
    children: [
      {
        title: EUserModules.UserManagment,
        path: '/user',
      },
      {
        title: EUserModules.RolePermission,
        path: '/role',
      },
      {
        title: EUserModules.CustomerGroupManagement,
        path: '/customer-group',
      },
    ],
  },
  {
    title: 'Sales Operations',
    icon: 'receipt',
    children: [
      {
        title: EUserModules.ReceiptManagement,
        path: '/receipt',
      },
      {
        title: EUserModules.BillGeneration,
        path: '/bill-generation',
      },
      {
        title: EUserModules.CashInCashOutManagement,
        path: '/cashInOut',
      },
      {
        title: EUserModules.SalesManagement,
        path: '/sale',
      },
      {
        title: EUserModules.SaleAndReturnManagement,
        path: '/return',
      },
      {
        title: EUserModules.ShopDiscountsModule,
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
        title: EUserModules.VariantManagement,
        path: '/variant',
      },
      {
        title: EUserModules.CategoryManagement,
        path: '/category',
      },
      {
        title: EUserModules.ArticleManagement,
        path: '/article',
      },
      {
        title: EUserModules.InventoryManagement,
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
        title: EUserModules.ShopManagement,
        path: '/shop',
      },
      {
        title: EUserModules.GoodsReceiptNotes,
        path: '/goods-receipt',
      },
      {
        title: EUserModules.StockTransferRequests,
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
        title: EUserModules.Report,
        caption: 'quasar.dev',
        path: '/report',
      },
    ],
  },
];
const allowedLinks = computed(() => {
  if (authStore) {
    console.log('s');
  }
  const allowedList = essentialLinks.map((linkGroup) => ({
    ...linkGroup,
    children: linkGroup.children.filter((link) =>
      authStore.checkUserHasPermission(link.title, EActionPermissions.View)
    ),
  }));
  return allowedList.filter((linkGroup) => linkGroup.children.length > 0);
});
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
