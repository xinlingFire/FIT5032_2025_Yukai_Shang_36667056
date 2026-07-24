import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { currentUser, isAuthenticated } from '../services/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/books/:id',
      name: 'book-detail',
      component: () => import('../views/BookDetailView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('../views/AdminDashboardView.vue'),
      meta: { requiresAuth: true, allowedRoles: ['admin'] }
    },
    {
      path: '/access-denied',
      name: 'access-denied',
      component: () => import('../views/AccessDeniedView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
        reason: 'authentication-required'
      }
    }
  }

  if (to.meta.guestOnly && isAuthenticated.value) {
    return { name: 'account' }
  }

  if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(currentUser.value?.role)) {
    return { name: 'access-denied' }
  }

  return true
})

export default router
