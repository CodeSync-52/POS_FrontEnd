<template>
  <div>
    <q-drawer
      v-model="isOpen"
      @update:model-value="handleChange"
      show-if-above
      bordered
    >
      <q-list
        class="bg-signature gap-4 flex-nowrap flex flex-col max-h-[100vh] h-full overflow-y-scroll mainlayoutSidebar"
      >
        <q-item-label class="flex w-full justify-end !p-0" header>
          <q-icon
            name="close"
            flat
            @click="handleChange"
            dense
            round
            size="25px"
            class="lg:hidden"
          />
        </q-item-label>
        <div class="w-[140px] h-[42px] mx-auto">
          <img
            src="/assets/Pos-icon.png"
            alt="POS Icon"
            class="text-signature"
          />
        </div>

        <div v-for="link in allowedLinks" :key="link.title">
          <q-expansion-item
            group="somegroup"
            :default-opened="true"
            expand-icon-class="text-text_primary hover:text-btn-primary"
            :icon="link.icon"
            :label="link.title"
          >
            <q-card class="bg-signature">
              <q-card-section class="q-py-none q-pl-lg">
                <router-link
                  v-for="subLinks in link?.children"
                  :key="subLinks.title"
                  :to="subLinks.path"
                  class="pl-7"
                  :class="{ active: isActiveRoute(subLinks.path) }"
                >
                  <div
                    class="text-[0.9rem] pl-12 py-2 hover:bg-text_hover hover:text-btn-primary transition-all rounded-md cursor-pointer"
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
</template>
<script lang="ts" setup>
import { useAuthStore } from 'src/stores';
import { computed } from 'vue';
import {
  EActionPermissions,
  EUserModules,
  getRoleModuleDisplayName,
} from 'src/interfaces';
import { useRoute } from 'vue-router';
interface IProps {
  modelValue: boolean;
}
const route = useRoute();
const isActiveRoute = (path: string) => route.path === path;
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
  const allowedList = essentialLinks.map((linkGroup) => ({
    ...linkGroup,
    children: linkGroup.children.filter((link) =>
      authStore.checkUserHasPermission(link.title, EActionPermissions.View)
    ),
  }));
  return allowedList.filter((linkGroup) => linkGroup.children.length > 0);
});
const emit = defineEmits<{
  (event: 'update:model-value', param: boolean): void;
}>();
const handleChange = (newVal: boolean) => {
  emit('update:model-value', newVal);
};
const isOpen = computed(() => props.modelValue);
const props = withDefaults(defineProps<IProps>(), { modelValue: true });
</script>
