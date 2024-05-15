import { EUserModules } from 'src/interfaces';
import { RouteRecordRaw } from 'vue-router';

export const routeList = [
  {
    path: '/permission-not-allowed',
    component: () => import('pages/PermissionNotAllowed.vue'),
  },
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
    path: '/custom-barcode',
    component: () => import('src/pages/inventory/Custom-Barcode.vue'),
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
    component: () => import('src/pages/return/Sales-Return-Management.vue'),
    meta: {
      module: EUserModules.SaleAndReturnManagement,
    },
  },
  {
    path: '/shop-sale/shop-summary',
    component: () => import('src/pages/return/Shop-Summary.vue'),
    meta: {
      module: EUserModules.SaleAndReturnManagement,
    },
  },
  {
    path: '/shop-sale/all-bills',
    component: () => import('src/pages/return/All-Bills.vue'),
    meta: {
      module: EUserModules.SaleAndReturnManagement,
    },
  },
  {
    path: '/shop-sale/hold-bills',
    component: () => import('src/pages/return/All-Bills.vue'),
    meta: {
      module: EUserModules.SaleAndReturnManagement,
    },
  },
  {
    path: '/shop-sale/:id/preview',
    component: () => import('src/pages/return/Preview-Sale.vue'),
    meta: {
      module: EUserModules.SaleAndReturnManagement,
    },
  },
  {
    path: '/shop-sale/:id/editHoldBill',
    component: () => import('src/pages/return/Preview-Sale.vue'),
    meta: {
      module: EUserModules.SaleAndReturnManagement,
    },
  },
  {
    path: '/expenses',
    component: () => import('src/pages/expenses/Shop-Expenses.vue'),
    meta: {
      module: EUserModules.SaleAndReturnManagement,
    },
  },
  {
    path: '/account-report',
    component: () => import('src/pages/report/Account-reports.vue'),
    meta: {
      module: EUserModules.Report,
    },
  },
  {
    path: '/user-outstanding-report',
    component: () => import('src/pages/report/User-Outstanding-report.vue'),
    meta: {
      module: EUserModules.Report,
    },
  },
  {
    path: '/ho-stock-report',
    component: () => import('src/pages/report/HO-Stock-reports.vue'),
    meta: {
      module: EUserModules.Report,
    },
  },
  {
    path: '/ho-article-sale-report',
    component: () => import('src/pages/report/HO-Article-Sale-report.vue'),
    meta: {
      module: EUserModules.Report,
    },
  },
  {
    path: '/ho-article-sale-detail-report',
    component: () =>
      import('src/pages/report/HO-Article-Sale-Detail-reports.vue'),
    meta: {
      module: EUserModules.Report,
    },
  },
  {
    path: '/ho-article-purchase-detail-report',
    component: () =>
      import('src/pages/report/HO-Article-Purchase-Detail-reports.vue'),
    meta: {
      module: EUserModules.Report,
    },
  },
  {
    path: '/shop-stock-report',
    component: () => import('src/pages/report/Shop-Stock-report.vue'),
    meta: {
      module: EUserModules.Report,
    },
  },
  {
    path: '/shop-sale-stock-report',
    component: () => import('src/pages/report/Shop-Sale-Stock-report.vue'),
    meta: {
      module: EUserModules.Report,
    },
  },
  {
    path: '/shop-article-quantity-sale-report',
    component: () =>
      import('src/pages/report/Shop-Article-Quantity-Sale-Report.vue'),
    meta: {
      module: EUserModules.Report,
    },
  },
  {
    path: '/shop-sale-report',
    component: () => import('src/pages/report/Shop-Sale-report.vue'),
    meta: {
      module: EUserModules.Report,
    },
  },
  {
    path: '/vendor-sale-stock-report',
    component: () => import('src/pages/report/Vendor-Sale-Stock-Report.vue'),
    meta: {
      module: EUserModules.Report,
    },
  },
  {
    path: '/daily-sale-report',
    component: () => import('src/pages/report/Daily-Sale-Report.vue'),
    meta: {
      module: EUserModules.Report,
    },
  },
  {
    path: '/slow-article-sale-report',
    component: () => import('src/pages/report/Slow-Article-Sale-Report.vue'),
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
    component: () => import('src/pages/shop-account/Shop-Account.vue'),
    meta: {
      module: EUserModules.ShopAccountModule,
    },
  },
  {
    path: '/shop-account/transfer-to-shop-account',
    component: () =>
      import('src/pages/shop-account/Transfer-To-Shop-Account.vue'),
    meta: {
      module: EUserModules.ShopAccountModule,
    },
  },
  {
    path: '/shop-account/:id',
    component: () => import('src/pages/shop-account/Shop-Account-Summary.vue'),
    meta: {
      module: EUserModules.ShopAccountModule,
    },
  },
  {
    path: '/dashboard',
    component: () => import('src/pages/dashboard/PosDashboard.vue'),
  },
  {
    path: '/setting',
    component: () => import('src/pages/setting/Pos-Setting.vue'),
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
