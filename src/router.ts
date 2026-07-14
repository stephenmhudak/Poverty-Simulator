import { createWebHistory, createRouter } from 'vue-router'

import Home from './Pages/Home.vue'
import Simulation from './Pages/Simulation/index.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/simulation', component: Simulation },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})