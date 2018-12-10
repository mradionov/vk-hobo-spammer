import Vue from 'vue';
import VueRouter from 'vue-router';

import AuthPage from '../components/pages/AuthPage';
import LandingPage from '../components/pages/LandingPage';
import MessageIndexPage from '../components/pages/MessageIndexPage';
import MessageCreatePage from '../components/pages/MessageCreatePage';
import MessageEditPage from '../components/pages/MessageEditPage';
import BundleIndexPage from '../components/pages/BundleIndexPage';
import BundleCreatePage from '../components/pages/BundleCreatePage';
import BundleEditPage from '../components/pages/BundleEditPage';
import PostIndexPage from '../components/pages/PostIndexPage';

const routes = [
  {
    path: '/',
    name: 'root',
    component: LandingPage,
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthPage,
  },
  {
    path: '/message/index',
    name: 'messageIndex',
    component: MessageIndexPage,
  },
  {
    path: '/message/create',
    name: 'messageCreate',
    component: MessageCreatePage,
    meta: { canBack: true },
  },
  {
    path: '/message/:messageId/edit',
    name: 'messageEdit',
    component: MessageEditPage,
    meta: { canBack: true },
  },
  {
    path: '/message/:messageId/bundle/index',
    name: 'bundleIndex',
    component: BundleIndexPage,
    meta: { canBack: true },
  },
  {
    path: '/message/:messageId/bundle/create',
    name: 'bundleCreate',
    component: BundleCreatePage,
    meta: { canBack: true },
  },
  {
    path: '/message/:messageId/bundle/:bundleId/edit',
    name: 'bundleEdit',
    component: BundleEditPage,
    meta: { canBack: true },
  },
  {
    path: '/message/:messageId/bundle/:bundleId/post/index',
    name: 'postIndex',
    component: PostIndexPage,
    meta: { canBack: true },
  },
];

function createRouter(store) {
  Vue.use(VueRouter);

  const router = new VueRouter({ routes });

  const anonymousPaths = [
    '/',
    '/auth',
  ];

  router.beforeEach((from, to, next) => {
    if (!store.getters.isAuthenticated && !anonymousPaths.includes(from.path)) {
      next('/');
      return;
    }
    next();
  });

  return router;
}

export default createRouter;
