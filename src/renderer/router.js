import Vue from 'vue';
import VueRouter from 'vue-router';

import AuthPage from './components/pages/AuthPage';
import LandingPage from './components/pages/LandingPage';
import MessageIndexPage from './components/pages/MessageIndexPage';
import MessageCreatePage from './components/pages/MessageCreatePage';
import MessageEditPage from './components/pages/MessageEditPage';
import PostIndexPage from './components/pages/PostIndexPage';
import PostCreatePage from './components/pages/PostCreatePage';

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
    path: '/messages',
    component: MessageIndexPage,
  },
  {
    path: '/messages/create',
    component: MessageCreatePage,
    meta: { canBack: true },
  },
  {
    path: '/messages/:messageId/edit',
    name: 'messagesEdit',
    component: MessageEditPage,
    meta: { canBack: true },
  },
  {
    path: '/messages/:messageId/posts',
    name: 'messagesPosts',
    component: PostIndexPage,
    meta: { canBack: true },
  },
  {
    path: '/message/:messageId/posts/create',
    name: 'postsCreate',
    component: PostCreatePage,
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
    if (store.token === null && !anonymousPaths.includes(from.path)) {
      next('/');
      return;
    }
    next();
  });

  return router;
}

export default createRouter;
