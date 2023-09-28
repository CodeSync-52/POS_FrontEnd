import { EUserModules } from 'src/interfaces';
import { RouteRecordRaw } from 'vue-router';

export const routeList = [
  {
    path: '/role',
    component: () => import('src/pages/role/RoleManagement.vue'),
    meta: {
      module: EUserModules.RolePermission,
    },
  },
  {
    path: '/user',
    component: () => import('src/pages/users/UserManagement.vue'),
    meta: {
      module: EUserModules.UserManagment,
    },
  },
  {
    path: '/customer-group',
    component: () =>
      import('src/pages/customer-group/CustomerGroupManagement.vue'),
    meta: {
      module: EUserModules.CustomerGroupManagement,
    },
  },
  {
    path: '/variant/:name/:id/:status',
    component: () => import('src/pages/variant/SelectedVariantDetails.vue'),
    meta: {
      module: EUserModules.VariantManagement,
    },
  },
  {
    path: '/variant',
    component: () => import('src/pages/variant/VariantManagement.vue'),
    meta: {
      module: EUserModules.VariantManagement,
    },
  },

  {
    path: '/category/:name/:id',
    component: () => import('src/pages/category/SelectedCategoryDetails.vue'),
    meta: {
      module: EUserModules.CategoryManagement,
    },
  },
  {
    path: '/category',
    component: () => import('src/pages/category/CategoryManagement.vue'),
    meta: {
      module: EUserModules.CategoryManagement,
    },
  },

  {
    path: '/sale',
    component: () => import('src/pages/sale/SalesManagement.vue'),
    meta: {
      module: EUserModules.SalesManagement,
    },
  },
  {
    path: '/sale/:id',
    component: () => import('src/pages/sale/AddNewSale.vue'),
    meta: {
      module: EUserModules.SalesManagement,
    },
  },
  {
    path: '/sale/add-new',
    component: () => import('src/pages/sale/AddNewSale.vue'),
    meta: {
      module: EUserModules.SalesManagement,
    },
  },
  {
    path: '/sale/:id/preview',
    component: () => import('src/pages/sale/AddNewSale.vue'),
    meta: {
      module: EUserModules.SalesManagement,
    },
  },
  {
    path: '/receipt',
    component: () => import('src/pages/receipt/ReceiptManagement.vue'),
    meta: {
      module: EUserModules.ReceiptManagement,
    },
  },
  {
    path: '/receipt/add-new',
    component: () => import('src/pages/receipt/AddNewReceipt.vue'),
    meta: {
      module: EUserModules.ReceiptManagement,
    },
  },
  {
    path: '/receipt/:id',
    component: () => import('src/pages/receipt/AddNewReceipt.vue'),
    meta: {
      module: EUserModules.ReceiptManagement,
    },
  },
  {
    path: '/receipt/:id/preview',
    component: () => import('src/pages/receipt/AddNewReceipt.vue'),
    meta: {
      module: EUserModules.ReceiptManagement,
    },
  },
  {
    path: '/bill-generation',
    component: () => import('src/pages/bill-generation/BillGeneration.vue'),
    meta: {
      module: EUserModules.BillGeneration,
    },
  },
  {
    path: '/bill-generation/add-new',
    component: () => import('src/pages/bill-generation/AddNewBill.vue'),
    meta: {
      module: EUserModules.BillGeneration,
    },
  },
  {
    path: '/bill-generation/:id/generate-receipt-bill',
    component: () => import('src/pages/bill-generation/AddNewBill.vue'),
    meta: {
      module: EUserModules.BillGeneration,
    },
  },
  {
    path: '/bill-generation/:id/edit-bill',
    component: () => import('src/pages/bill-generation/AddNewBill.vue'),
    meta: {
      module: EUserModules.BillGeneration,
    },
  },
  {
    path: '/bill-generation/:id/preview',
    component: () => import('src/pages/bill-generation/AddNewBill.vue'),
    meta: {
      module: EUserModules.BillGeneration,
    },
  },
  {
    path: '/inventory',
    component: () => import('src/pages/inventory/InventoryManagement.vue'),
    meta: {
      module: EUserModules.InventoryManagement,
    },
  },
  {
    path: '/goods-receipt',
    component: () => import('src/pages/goods-receipt/GoodReceiptNotes.vue'),
    meta: {
      module: EUserModules.GoodsReceiptNotes,
    },
  },
  {
    path: '/discount',
    component: () => import('src/pages/discount/ShopDiscount.vue'),
    meta: {
      module: EUserModules.ShopDiscountsModule,
    },
  },
  {
    path: '/return',
    component: () => import('src/pages/return/SalesReturnManagement.vue'),
    meta: {
      module: EUserModules.SaleAndReturnManagement,
    },
  },
  {
    path: '/report',
    component: () => import('src/pages/report/ReportManagement.vue'),
    meta: {
      module: EUserModules.Report,
    },
  },
  {
    path: '/cash-flow',
    component: () => import('src/pages/cash-flow/CashFlow.vue'),
    meta: {
      module: EUserModules.CashInCashOutManagement,
    },
  },
  {
    path: '/cash-flow/add-new',
    component: () => import('src/pages/cash-flow/AddNewCashFlow.vue'),
    meta: {
      module: EUserModules.CashInCashOutManagement,
    },
  },
  {
    path: '/article',
    component: () => import('pages/article/ArticleManagement.vue'),
    meta: {
      module: EUserModules.ArticleManagement,
    },
  },
  {
    path: '/article/add-new',
    component: () => import('pages/article/AddNewArticle.vue'),
    meta: {
      module: EUserModules.ArticleManagement,
    },
  },
  {
    path: '/article/:id/update',
    component: () => import('pages/article/AddNewArticle.vue'),
    meta: {
      module: EUserModules.ArticleManagement,
    },
  },
  {
    path: '/shop',
    component: () => import('src/pages/shop/ShopManagement.vue'),
    meta: {
      module: EUserModules.ShopManagement,
    },
  },
  {
    path: '/stock-transfer',
    component: () => import('pages/stock-transfer/StockTransferRequest.vue'),

    meta: {
      module: EUserModules.StockTransferRequests,
    },
  },
];

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('src/pages/auth/LoginPage.vue'),
    name: 'Login',
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: routeList,
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    // component: () => import('pages/ErrorNotFound.vue'),
    redirect: '/user',
  },
];

export default routes;
