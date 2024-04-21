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
            @click="handleChange(!modelValue)"
            dense
            round
            size="25px"
            class="lg:hidden"
          />
        </q-item-label>
        <div class="max-w-[160px] mx-auto">
          <img
            src="/assets/shoeStore.png"
            alt="POS Icon"
            class="text-signature"
          />
        </div>
        <div v-for="link in allowedLinks" :key="link.title">
          <q-expansion-item
            group="somegroup"
            :default-opened="false"
            expand-icon-class="text-text_primary hover:text-btn-primary"
            :icon="link.icon"
            :label="link.title"
          >
            <q-card class="bg-signature">
              <q-card-section class="q-py-none q-pl-lg">
                <router-link
                  v-for="subLinks in filteredSubLinks(link.children)"
                  :key="subLinks.title"
                  :to="subLinks.path"
                  class="pl-7"
                  :class="{ active: isActiveRoute(subLinks.path) }"
                >
                  <div
                    class="text-[0.9rem] pl-12 py-2 hover:bg-text_hover hover:text-btn-primary transition-all rounded-md cursor-pointer"
                  >
                    {{
                      subLinks.path === '/expenses'
                        ? 'Expense'
                        : subLinks.path === '/shop-account'
                        ? 'Shop Account'
                        : subLinks.path === '/account-report'
                        ? 'Account Report'
                        : subLinks.path === '/user-outstanding-report'
                        ? 'User Outstanding Report'
                        : subLinks.path === '/ho-stock-report'
                        ? 'HO Stock Report'
                        : subLinks.path === '/ho-article-sale-report'
                        ? 'HO Article Sale Report'
                        : subLinks.path === '/ho-article-sale-detail-report'
                        ? 'HO Article Sale Detail Report'
                        : subLinks.path === '/ho-article-sale-detail-report'
                        ? 'HO Article Sale Detail Report'
                        : subLinks.path === '/ho-article-purchase-detail-report'
                        ? 'HO Article Purchase Detail Report'
                        : getRoleModuleDisplayName(subLinks.title)
                    }}
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
  EUserRoles,
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
    title: 'Store Management',
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
      {
        title: EUserModules.VariantManagement,
        path: '/variant',
      },
      {
        title: EUserModules.CategoryManagement,
        path: '/category',
      },
      {
        title: EUserModules.ShopManagement,
        path: '/shop',
      },
    ],
  },
  {
    title: 'Product Management',
    caption: 'quasar.dev',
    icon: 'local_florist',
    children: [
      {
        title: EUserModules.ArticleManagement,
        path: '/article',
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
        title: EUserModules.SalesManagement,
        path: '/sale',
      },
      {
        title: EUserModules.SaleAndReturnManagement,
        path: '/shop-sale',
      },
    ],
  },

  {
    title: 'Stock Management',
    caption: 'quasar.dev',
    icon: 'store',
    children: [
      {
        title: EUserModules.GoodsReceiptNotes,
        path: '/goods-receipt',
      },
      {
        title: EUserModules.StockTransferRequests,
        path: '/stock-transfer',
      },
      {
        title: EUserModules.InventoryManagement,
        path: '/inventory',
      },
    ],
  },
  {
    title: 'Cash Flow Management',
    caption: 'quasar.dev',
    icon: 'currency_exchange',
    children: [
      {
        title: EUserModules.CashInCashOutManagement,
        path: '/cash-flow',
      },
      {
        title: EUserModules.CashInCashOutManagement,
        path: '/shop-account',
      },
    ],
  },
  {
    title: 'Reporting and Analytics',
    icon: 'chat',
    children: [
      {
        title: EUserModules.Report,
        path: '/account-report',
      },
      {
        title: EUserModules.Report,
        path: '/user-outstanding-report',
      },
      {
        title: EUserModules.Report,
        path: '/ho-stock-report',
      },
      {
        title: EUserModules.Report,
        path: '/ho-article-sale-report',
      },
      {
        title: EUserModules.Report,
        path: '/ho-article-sale-detail-report',
      },
      {
        title: EUserModules.Report,
        path: '/ho-article-purchase-detail-report',
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
const filteredSubLinks = (
  subLinks: { title: EUserModules; path: string }[]
) => {
  const isSuperAdmin =
    authStore.loggedInUser?.rolePermissions.roleName ===
    EUserRoles.SuperAdmin.toLowerCase();
  if (isSuperAdmin) {
    return subLinks;
  } else {
    return subLinks.filter(
      (subLink) =>
        subLink.path !== '/shop-account' && subLink.path !== 'expenses'
    );
  }
};
</script>
