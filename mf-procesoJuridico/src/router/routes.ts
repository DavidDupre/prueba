import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    children: [
      { path: '', component: () => import('../pages/IndexPage.vue') },
      {
        path: 'Ministry-Labor',
        children: [
          {
            path: 'applications',
            component: () => import('../pages/ApplicationsMinistryLabor.vue'),
          },
          {
            path: 'revision',
            component: () => import('../pages/ministry-labor/Revision.vue'),
          },
        ],
      },
      {
        path: 'file/:id',
        component: () => import('../pages/file/[id].vue'),
      },
      {
        path: 'gestionar',
        component: () => import('../pages/Gestionar.vue'),
      },
    ],
  },
];

export default routes;
