import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/landing.vue'
import MapView from '../views/map.vue'
import Login from '../views/login.vue'
import Dashboard from '../views/dashboard.vue' // Halaman baru

const routes = [
  { path: '/', name: 'Landing', component: Landing },
  { path: '/login', name: 'Login', component: Login },
  { path: '/map', name: 'Map', component: MapView }, // Terbuka untuk publik!
  { 
    path: '/admin', 
    name: 'Dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true } // Hanya staf/admin yang punya tiket yang bisa masuk
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Penjaga pintu: Hanya memeriksa rute yang butuh login (requiresAuth)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  if (to.meta.requiresAuth && !token) {
    alert("Akses khusus Pengelola! Silakan login.");
    next('/login');
  } else {
    next();
  }
})

export default router