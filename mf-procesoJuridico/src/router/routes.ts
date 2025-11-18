import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    children: [
      { path: '', component: () => import('../pages/IndexPage.vue') },
      {
        path: 'gestionar',
        component: () => import('../pages/Gestionar.vue'),
      },
    ],
  },
];

export default routes;
