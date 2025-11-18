import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "Ministry-Labor",
        children: [
          {
            path: "file/:id",
            component: () => import("../pages/file/[id].vue"),
          },
          {
            path: "applications",
            component: () => import("../pages/IndexPage.vue"),
          },
          {
            path: "revision",
            component: () => import("../pages/ministry-labor/Revision.vue"),
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
