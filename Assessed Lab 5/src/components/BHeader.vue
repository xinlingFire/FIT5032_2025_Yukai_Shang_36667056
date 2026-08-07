<script setup>
import { useRouter } from 'vue-router'
import {
  currentUser,
  isAuthenticated,
  logout
} from '../auth'
import { signOut } from 'firebase/auth'
import {
  firebaseAuth,
  firebaseCurrentUser
} from '../firebase'

const router = useRouter()

const handleLogout = () => {
  logout()

  router.push({
    name: 'login'
  })
}

const handleFirebaseLogout = async () => {
  await signOut(firebaseAuth)
  console.log(
    'Current Firebase user after logout:',
    firebaseAuth.currentUser
  )

  router.push({ name: 'FireLogin' })
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
            to="/addbook"
            class="nav-link"
            active-class="active"
          >
            Add Book
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/get-book-count"
            class="nav-link"
            active-class="active"
          >
            Book Counter
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/book-store"
            class="nav-link"
            active-class="active"
          >
            Book Store
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/WeatherCheck"
            class="nav-link"
            active-class="active"
          >
            Get Weather
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/CountBookAPI"
            class="nav-link"
            active-class="active"
          >
            Count Book API
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

        <li class="nav-item">
          <RouterLink
            to="/FireRegister"
            class="nav-link"
            active-class="active"
          >
            Firebase register
          </RouterLink>
        </li>

        <template v-if="firebaseCurrentUser">
          <li class="nav-item">
            <span class="nav-link text-success">
              Firebase: {{ firebaseCurrentUser.email }}
            </span>
          </li>

          <li class="nav-item">
            <button
              type="button"
              class="nav-link logout-button"
              @click="handleFirebaseLogout"
            >
              Firebase logout
            </button>
          </li>
        </template>

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
