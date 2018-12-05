import Vue from 'vue';
import VueRouter from 'vue-router';

import AuthPage from './components/pages/AuthPage';
import LandingPage from './components/pages/LandingPage';
import MessageIndexPage from './components/pages/MessageIndexPage';
import MessageCreatePage from './components/pages/MessageCreatePage';
import MessageEditPage from './components/pages/MessageEditPage';
import PostIndexPage from './components/pages/PostIndexPage';
import PostCreatePage from './components/pages/PostCreatePage';
import PostEditPage from './components/pages/PostEditPage';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: LandingPage,
  },
  {
    path: '/auth',
    component: AuthPage,
  },
  {
    path: '/message/index',
    component: MessageIndexPage,
  },
  {
    path: '/message/create',
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
    path: '/message/:messageId/post/index',
    name: 'postIndex',
    component: PostIndexPage,
    meta: { canBack: true },
  },
  {
    path: '/message/:messageId/post/create',
    name: 'postCreate',
    component: PostCreatePage,
    meta: { canBack: true },
  },
  {
    path: '/message/:messageId/post/:postId/edit',
    name: 'postEdit',
    component: PostEditPage,
    meta: { canBack: true },
  },
];

function createRouter(store) {
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
