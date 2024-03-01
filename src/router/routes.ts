import { EUserModules } from 'src/interfaces';
import { RouteRecordRaw } from 'vue-router';

export const routeList = [
  {
    path: '/role',
    component: () => import('src/pages/role/Role-Management.vue'),
    meta: {
      module: EUserModules.RolePermission,
    },
  },
  {
    path: '/user',
    component: () => import('src/pages/users/User-Management.vue'),
    meta: {
      module: EUserModules.UserManagment,
    },
  },
  {
    path: '/customer-group',
    component: () =>
      import('src/pages/customer-group/Customer-Group-Management.vue'),
    meta: {
      module: EUserModules.CustomerGroupManagement,
    },
  },
  {
    path: '/variant/:name/:id/:status',
    component: () => import('src/pages/variant/Selected-Variant-Details.vue'),
    meta: {
      module: EUserModules.VariantManagement,
    },
  },
  {
    path: '/variant',
    component: () => import('src/pages/variant/Variant-Management.vue'),
    meta: {
      module: EUserModules.VariantManagement,
    },
  },

  {
    path: '/category/:name/:id',
    component: () => import('src/pages/category/Selected-Category-Details.vue'),
    meta: {
      module: EUserModules.CategoryManagement,
    },
  },
  {
    path: '/category',
    component: () => import('src/pages/category/Category-Management.vue'),
    meta: {
      module: EUserModules.CategoryManagement,
    },
  },

  {
    path: '/sale',
    component: () => import('src/pages/sale/Sales-Management.vue'),
    meta: {
      module: EUserModules.SalesManagement,
    },
  },
  {
    path: '/sale/:id',
    component: () => import('src/pages/sale/Add-New-Sale.vue'),
    meta: {
      module: EUserModules.SalesManagement,
    },
  },
  {
    path: '/sale/add-new',
    component: () => import('src/pages/sale/Add-New-Sale.vue'),
    meta: {
      module: EUserModules.SalesManagement,
    },
  },
  {
    path: '/sale/:id/preview',
    component: () => import('src/pages/sale/Add-New-Sale.vue'),
    meta: {
      module: EUserModules.SalesManagement,
    },
  },
  {
    path: '/receipt',
    component: () => import('src/pages/receipt/Receipt-Management.vue'),
    meta: {
      module: EUserModules.ReceiptManagement,
    },
  },
  {
    path: '/receipt/add-new',
    component: () => import('src/pages/receipt/Add-New-Receipt.vue'),
    meta: {
      module: EUserModules.ReceiptManagement,
    },
  },
  {
    path: '/receipt/:id',
    component: () => import('src/pages/receipt/Add-New-Receipt.vue'),
    meta: {
      module: EUserModules.ReceiptManagement,
    },
  },
  {
    path: '/receipt/:id/preview',
    component: () => import('src/pages/receipt/Add-New-Receipt.vue'),
    meta: {
      module: EUserModules.ReceiptManagement,
    },
  },
  {
    path: '/bill-generation',
    component: () => import('src/pages/bill-generation/Bill-Generation.vue'),
    meta: {
      module: EUserModules.BillGeneration,
    },
  },
  {
    path: '/bill-generation/add-new',
    component: () => import('src/pages/bill-generation/Add-New-Bill.vue'),
    meta: {
      module: EUserModules.BillGeneration,
    },
  },
  {
    path: '/bill-generation/:id/generate-receipt-bill',
    component: () => import('src/pages/bill-generation/Add-New-Bill.vue'),
    meta: {
      module: EUserModules.BillGeneration,
    },
  },
  {
    path: '/bill-generation/:id/edit-bill',
    component: () => import('src/pages/bill-generation/Add-New-Bill.vue'),
    meta: {
      module: EUserModules.BillGeneration,
    },
  },
  {
    path: '/bill-generation/:id/preview',
    component: () => import('src/pages/bill-generation/Add-New-Bill.vue'),
    meta: {
      module: EUserModules.BillGeneration,
    },
  },
  {
    path: '/inventory',
    component: () => import('src/pages/inventory/Inventory-Management.vue'),
    meta: {
      module: EUserModules.InventoryManagement,
    },
  },
  {
    path: '/inventory/add-new/:id?',
    component: () => import('src/pages/inventory/Add-New-Inventory.vue'),
    meta: {
      module: EUserModules.InventoryManagement,
    },
  },
  {
    path: '/inventory/add-custom',
    component: () => import('src/pages/inventory/Add-New-Inventory.vue'),
    meta: {
      module: EUserModules.InventoryManagement,
    },
  },
  {
    path: '/goods-receipt',
    component: () => import('src/pages/goods-receipt/Good-Receipt-Notes.vue'),
    meta: {
      module: EUserModules.GoodsReceiptNotes,
    },
  },
  {
    path: '/goods-receipt/add-new',
    component: () => import('src/pages/goods-receipt/Add-New-Grn.vue'),
    meta: {
      module: EUserModules.GoodsReceiptNotes,
    },
  },
  {
    path: '/shop-sale',
    component: () => import('src/pages/return/SalesReturnManagement.vue'),
    meta: {
      module: EUserModules.SaleAndReturnManagement,
    },
  },
  {
    path: '/shop-sale/return-sales',
    component: () => import('src/pages/return/ReturnSales.vue'),
    meta: {
      module: EUserModules.SaleAndReturnManagement,
    },
  },
  {
    path: '/shop-sale/today-sale-summary',
    component: () => import('src/pages/return/TodaySaleSummary.vue'),
    meta: {
      module: EUserModules.SaleAndReturnManagement,
    },
  },
  {
    path: '/shop-sale/all-bills',
    component: () => import('src/pages/return/AllBills.vue'),
    meta: {
      module: EUserModules.SaleAndReturnManagement,
    },
  },
  {
    path: '/shop-sale/hold-bills',
    component: () => import('src/pages/return/AllBills.vue'),
    meta: {
      module: EUserModules.SaleAndReturnManagement,
    },
  },
  {
    path: '/shop-sale/:id/preview',
    component: () => import('src/pages/return/SalesReturnManagement.vue'),
    meta: {
      module: EUserModules.SaleAndReturnManagement,
    },
  },
  {
    path: '/shop-sale/:id/editHoldBill',
    component: () => import('src/pages/return/SalesReturnManagement.vue'),
    meta: {
      module: EUserModules.SaleAndReturnManagement,
    },
  },
  {
    path: '/expenses',
    component: () => import('src/pages/expenses/ShopExpenses.vue'),
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
    component: () => import('src/pages/cash-flow/Cash-Flow.vue'),
    meta: {
      module: EUserModules.CashInCashOutManagement,
    },
  },
  {
    path: '/cash-flow/add-new',
    component: () => import('src/pages/cash-flow/Add-New-Cash-Flow.vue'),
    meta: {
      module: EUserModules.CashInCashOutManagement,
    },
  },
  {
    path: '/article',
    component: () => import('pages/article/Article-Management.vue'),
    meta: {
      module: EUserModules.ArticleManagement,
    },
  },
  {
    path: '/article/add-new',
    component: () => import('pages/article/Add-New-Article.vue'),
    meta: {
      module: EUserModules.ArticleManagement,
    },
  },
  {
    path: '/article/:id/update',
    component: () => import('pages/article/Add-New-Article.vue'),
    meta: {
      module: EUserModules.ArticleManagement,
    },
  },
  {
    path: '/shop',
    component: () => import('src/pages/shop/Shop-Management.vue'),
    meta: {
      module: EUserModules.ShopManagement,
    },
  },
  {
    path: '/stock-transfer',
    component: () => import('pages/stock-transfer/Stock-Transfer-Request.vue'),
    meta: {
      module: EUserModules.StockTransferRequests,
    },
  },
  {
    path: '/stock-transfer/:id',
    component: () => import('pages/stock-transfer/Preview-Str.vue'),
    meta: {
      module: EUserModules.StockTransferRequests,
    },
  },
  {
    path: '/stock-transfer/:id/edit',
    component: () => import('pages/stock-transfer/Preview-Str.vue'),
    meta: {
      module: EUserModules.StockTransferRequests,
    },
  },
  {
    path: '/shop-account',
    component: () => import('src/pages/shop-account/ShopAccount.vue'),
    meta: {
      module: EUserModules.CashInCashOutManagement,
    },
  },
  {
    path: '/shop-account/transfer-to-shop-account',
    component: () => import('src/pages/shop-account/TransferToShopAccount.vue'),
    meta: {
      module: EUserModules.CashInCashOutManagement,
    },
  },
  {
    path: '/shop-account/:id',
    component: () => import('src/pages/shop-account/ShopAccountSummary.vue'),
    meta: {
      module: EUserModules.CashInCashOutManagement,
    },
  },
];

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('src/pages/auth/Login-Page.vue'),
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
