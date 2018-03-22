import Vue from 'vue';
import VueRouter from 'vue-router';

import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import JobPage from './pages/JobPage';

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
    path: '/job',
    component: JobPage,
  },
];

function createRouter(store) {
  const router = new VueRouter({ routes });

  const allowedPaths = [
    '/',
    '/auth',
  ];

  router.beforeEach((from, to, next) => {
    if (store.token === null && !allowedPaths.includes(from.path)) {
      next('/');
      return;
    }
    next();
  });

  return router;
}

export default createRouter;
