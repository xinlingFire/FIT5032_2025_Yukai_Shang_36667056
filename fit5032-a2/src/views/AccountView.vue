<script setup>
import { useRouter } from 'vue-router'
import { currentUser, logout } from '../services/auth'

const router = useRouter()

const handleLogout = () => {
  logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <main class="account-page">
    <section class="account-card">
      <p class="eyebrow">Your Open Shelf account</p>
      <h1>Welcome, {{ currentUser?.name }}.</h1>
      <p class="account-intro">You are logged in and can continue browsing the catalogue.</p>

      <dl class="account-details">
        <div>
          <dt>Email address</dt>
          <dd>{{ currentUser?.email }}</dd>
        </div>
        <div>
          <dt>Account created</dt>
          <dd>{{ new Date(currentUser?.createdAt).toLocaleDateString() }}</dd>
        </div>
      </dl>

      <div class="d-flex flex-wrap gap-3">
        <RouterLink class="btn btn-primary" to="/">Browse catalogue</RouterLink>
        <button class="btn btn-outline-secondary" type="button" @click="handleLogout">Log out</button>
      </div>
    </section>
  </main>
</template>
