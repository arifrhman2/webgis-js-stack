// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import MapView from '../views/map.vue'
import Login from '../views/login.vue' // Untuk pengembangan tahap login nanti

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Landing
  },
  {
    path: '/map',
    name: 'Map',
    component: MapView
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router