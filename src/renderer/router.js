import Vue from 'vue';
import VueRouter from 'vue-router';

import AuthPage from './components/pages/AuthPage';
import LandingPage from './components/pages/LandingPage';
import JobIndexPage from './components/pages/JobIndexPage';
import JobCreatePage from './components/pages/JobCreatePage';
import JobEditPage from './components/pages/JobEditPage';

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
    path: '/jobs',
    component: JobIndexPage,
  },
  {
    path: '/jobs/create',
    component: JobCreatePage,
  },
  {
    path: '/jobs/:jobId/edit',
    name: 'jobsEdit',
    component: JobEditPage,
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
