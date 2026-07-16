<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../auth'

const username = ref('')
const password = ref('')

const router = useRouter()
const route = useRoute()

const showAuthenticationMessage = computed(() => {
  return route.query.reason === 'authentication-required'
})

const handleLogin = () => {
  const loginSuccessful = login(
    username.value,
    password.value
  )

  if (loginSuccessful) {
    const redirectPath =
      typeof route.query.redirect === 'string'
        ? route.query.redirect
        : '/about'

    router.push(redirectPath)
  } else {
    router.push({
      name: 'access-denied',
      query: {
        reason: 'invalid-credentials'
      }
    })
  }
}
</script>

<template>
  <main class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <h1 class="text-center mb-4">Library Login</h1>

            <div
              v-if="showAuthenticationMessage"
              class="alert alert-warning"
            >
              You must log in before accessing the About page.
            </div>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label
                  for="loginUsername"
                  class="form-label"
                >
                  Username
                </label>

                <input
                  id="loginUsername"
                  v-model="username"
                  type="text"
                  class="form-control"
                  autocomplete="username"
                  required
                />
              </div>

              <div class="mb-3">
                <label
                  for="loginPassword"
                  class="form-label"
                >
                  Password
                </label>

                <input
                  id="loginPassword"
                  v-model="password"
                  type="password"
                  class="form-control"
                  autocomplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100"
              >
                Login
              </button>
            </form>

            <div class="alert alert-info mt-4 mb-0">
              <strong>Test account:</strong><br />
              Username: admin<br />
              Password: Password123!
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
