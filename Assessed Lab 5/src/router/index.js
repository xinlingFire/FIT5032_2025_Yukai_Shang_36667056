import {
  createRouter,
  createWebHistory
} from 'vue-router'

import HomeView from '../views/HomeView.vue'
import { isAuthenticated } from '../auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () =>
      import('../views/AboutView.vue'),

    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () =>
      import('../views/ContactView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import('../views/LoginView.vue'),

    meta: {
      guestOnly: true
    }
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: () =>
      import('../views/AccessDeniedView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () =>
      import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL
  ),
  routes
})

router.beforeEach((to) => {
  if (
    to.meta.requiresAuth &&
    !isAuthenticated.value
  ) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
        reason: 'authentication-required'
      }
    }
  }

  if (
    to.meta.guestOnly &&
    isAuthenticated.value
  ) {
    return {
      name: 'about'
    }
  }

  return true
})

export default router
