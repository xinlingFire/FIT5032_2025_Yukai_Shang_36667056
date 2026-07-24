<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser, isAuthenticated, logout } from '../services/auth'

const menuIsOpen = ref(false)
const router = useRouter()

const closeMenu = () => {
  menuIsOpen.value = false
}

const handleLogout = () => {
  logout()
  closeMenu()
  router.push({ name: 'home' })
}
</script>

<template>
  <header class="site-header">
    <div class="container d-flex align-items-center justify-content-between gap-3 py-3">
      <RouterLink class="brand" to="/" @click="closeMenu">
        <span class="brand-mark" aria-hidden="true">OS</span>
        <span>
          <strong>Open Shelf</strong>
          <small>Library catalogue</small>
        </span>
      </RouterLink>

      <button
        class="menu-toggle d-md-none"
        type="button"
        :aria-expanded="menuIsOpen"
        aria-label="Toggle navigation"
        @click="menuIsOpen = !menuIsOpen"
      >
        <span></span><span></span><span></span>
      </button>

      <nav :class="['site-nav', { 'is-open': menuIsOpen }]" aria-label="Main navigation">
        <RouterLink to="/" @click="closeMenu">Catalogue</RouterLink>
        <RouterLink :to="{ name: 'home', hash: '#suggest' }" @click="closeMenu">Suggest a book</RouterLink>
        <RouterLink :to="{ name: 'home', hash: '#about' }" @click="closeMenu">About</RouterLink>
        <template v-if="isAuthenticated">
          <RouterLink to="/account" @click="closeMenu">My account</RouterLink>
          <RouterLink
            v-if="currentUser?.role === 'admin'"
            to="/admin"
            @click="closeMenu"
          >
            Manage library
          </RouterLink>
          <span class="nav-user">{{ currentUser?.name }}</span>
          <button class="nav-logout" type="button" @click="handleLogout">Log out</button>
        </template>
        <template v-else>
          <RouterLink to="/login" @click="closeMenu">Log in</RouterLink>
          <RouterLink class="nav-register" to="/register" @click="closeMenu">Create account</RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>
