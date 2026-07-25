<script setup>
import { useRouter } from 'vue-router'
import {
  currentUser,
  isAuthenticated,
  logout
} from '../auth'

const router = useRouter()

const handleLogout = () => {
  logout()

  router.push({
    name: 'login'
  })
}
</script>

<template>
  <!-- Using Bootstrap's Header template -->
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills align-items-center">
        <li class="nav-item">
          <RouterLink
            to="/"
            class="nav-link"
            exact-active-class="active"
          >
            Home (Week 5)
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/about"
            class="nav-link"
            active-class="active"
          >
            About
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/contact"
            class="nav-link"
            active-class="active"
          >
            Contact us
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/FireLogin"
            class="nav-link"
            active-class="active"
          >
            Firebase login
          </RouterLink>
        </li>

        <li
          v-if="!isAuthenticated"
          class="nav-item"
        >
          <RouterLink
            to="/login"
            class="nav-link"
            active-class="active"
          >
            Login
          </RouterLink>
        </li>

        <template v-else>
          <li class="nav-item">
            <span class="nav-link text-success">
              Welcome, {{ currentUser }}
            </span>
          </li>

          <li class="nav-item">
            <button
              type="button"
              class="nav-link logout-button"
              @click="handleLogout"
            >
              Logout
            </button>
          </li>
        </template>
      </ul>
    </header>
  </div>
</template>

<style scoped>
.logout-button {
  border: 0;
  background: transparent;
}
</style>
