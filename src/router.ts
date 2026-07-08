import { createWebHistory, createRouter } from 'vue-router'

import Home from './Pages/Home.vue'
import New from './Pages/New/index.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/new', component: New },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})