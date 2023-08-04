import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes, { routeList } from './routes';
import { useAuthStore } from 'src/stores';
import {
  EActionPermissions,
  EUserModules,
  checkNameIsModule,
} from 'src/interfaces';

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });
  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthorized = authStore.loggedInUser !== null;
    if (!isAuthorized && to.name !== 'Login') {
      next('/login');
      return;
    }
    const meta = to.meta.module;
    if (isAuthorized && to.name === 'Login') {
      const index = routeList.findIndex((route) => {
        const meta = route.meta?.module as EUserModules;
        return authStore.checkUserHasPermission(meta, EActionPermissions.View);
      });
      if (index < 0) {
        authStore.logoutUser();
        next('/login');
        return;
      }
      next(routeList[index].path);
      return;
    }
    if (!isAuthorized && to.name === 'Login') {
      next();
      return;
    }
    if (!checkNameIsModule(meta)) {
      next('/login');
      return;
    }
    if (!authStore.checkUserHasPermission(meta, EActionPermissions.View)) {
      const index = routeList.findIndex((route) => {
        const meta = route.meta?.module as EUserModules;
        return authStore.checkUserHasPermission(meta, EActionPermissions.View);
      });
      if (index < 0) {
        authStore.logoutUser();
        next('/login');
        return;
      }
      next(routeList[index].path);
      return;
    }
    next();
  });
  return Router;
});
