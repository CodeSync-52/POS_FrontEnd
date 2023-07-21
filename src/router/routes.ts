import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/MainPage.vue') }],
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/dashboard/PosDashboard.vue'),
      },
    ],
  },
  {
    path: '/role',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/role/RoleManagement.vue'),
      },
    ],
  },
  {
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/users/UserManagement.vue'),
      },
    ],
  },
  {
    path: '/customer-group',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () =>
          import('src/pages/customer-group/CustomerGroupManagement.vue'),
      },
    ],
  },
  {
    path: '/variant',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/variant/VariantManagement.vue'),
      },
    ],
  },
  {
    path: '/category',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/category/CategoryManagement.vue'),
      },
    ],
  },
  {
    path: '/sale',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/sale/SalesManagement.vue'),
      },
    ],
  },
  {
    path: '/receipt',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/receipt/ReceiptManagement.vue'),
      },
    ],
  },
  {
    path: '/bill-generation',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/bill-generation/BillGeneration.vue'),
      },
    ],
  },
  {
    path: '/inventory',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/inventory/InventoryManagement.vue'),
      },
    ],
  },
  {
    path: '/goods-receipt',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/goods-receipt/GoodReceiptNotes.vue'),
      },
    ],
  },
  {
    path: '/discount',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/discount/ShopDiscount.vue'),
      },
    ],
  },
  {
    path: '/return',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/return/SalesReturnManagement.vue'),
      },
    ],
  },
  {
    path: '/report',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/report/ReportManagement.vue'),
      },
    ],
  },
  {
    path: '/cashInOut',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/cashInOut/CashInOut.vue'),
      },
    ],
  },
  {
    path: '/article',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/article/ArticleManagement.vue'),
      },
    ],
  },
  {
    path: '/shop',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/shop/ShopManagement.vue'),
      },
    ],
  },
  {
    path: '/stock-transfer',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () =>
          import('pages/stock-transfer/StockTransferRequest.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
