import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      { path: '', name: 'index', component: () => import('../pages/IndexPage.vue'), },
      { path: 'spain', name: 'spain', component: () => import('../pages/SpainCalc.vue'), },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router