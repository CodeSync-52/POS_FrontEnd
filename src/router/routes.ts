import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/dashBoard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/dashboard/IndexPage.vue') }],
  },
  {
    path: '/role',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/role/IndexPage.vue') }],
  },
  {
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/users/IndexPage.vue') }],
  },
  {
    path: '/customer-group',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/customer-group/IndexPage.vue') }],
  },
  {
    path: '/variant',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/variant/IndexPage.vue') }],
  },
  {
    path: '/product',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/product/IndexPage.vue') }],
  },
  {
    path: '/category',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/category/IndexPage.vue') }],
  },
  {
    path: '/purchase',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/purchase/IndexPage.vue') }],
  },
  {
    path: '/sale',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/sale/IndexPage.vue') }],
  },
  {
    path: '/receipt',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/receipt/IndexPage.vue') }],
  },
  {
    path: '/bill-generation',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/bill-generation/IndexPage.vue') }],
  },
  {
    path: '/inventory',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/inventory/IndexPage.vue') }],
  },
  {
    path: '/goods-receipt',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/goods-receipt/IndexPage.vue') }],
  },
  {
    path: '/discount',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/discount/IndexPage.vue') }],
  },
  {
    path: '/return',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/return/IndexPage.vue') }],
  },
  {
    path: '/report',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/report/IndexPage.vue') }],
  },
  {
    path: '/cashInOut',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/cashInOut/IndexPage.vue') }],
  },
  {
    path: '/shop',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/shop/IndexPage.vue') }],
  },
 


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
