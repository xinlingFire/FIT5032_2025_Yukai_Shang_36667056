import {
  createRouter,
  createWebHistory
} from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AddBookView from '../views/AddBookView.vue'
import GetBookCountView from '../views/GetBookCountView.vue'
import BookStoreView from '../views/BookStoreView.vue'
import WeatherView from '../views/WeatherView.vue'
import CountBookAPI from '../views/CountBookAPI.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import { isAuthenticated } from '../auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/addbook',
    name: 'addbook',
    component: AddBookView
  },
  {
    path: '/get-book-count',
    name: 'get-book-count',
    component: GetBookCountView
  },
  {
    path: '/book-store',
    name: 'book-store',
    component: BookStoreView
  },
  {
    path: '/WeatherCheck',
    name: 'GetWeather',
    component: WeatherView
  },
  {
    path: '/CountBookAPI',
    name: 'CountBookAPI',
    component: CountBookAPI
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
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView
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
