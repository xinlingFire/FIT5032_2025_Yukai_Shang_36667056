<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../services/auth'

const router = useRouter()
const route = useRoute()
const form = reactive({
  email: '',
  password: ''
})
const errors = reactive({
  email: '',
  password: ''
})
const hasSubmitted = ref(false)
const loginError = ref('')
const isSubmitting = ref(false)

const validators = {
  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      ? ''
      : 'Enter a valid email address.'
  },
  password(value) {
    return value.length > 0 ? '' : 'Enter your password.'
  }
}

const validateField = (field) => {
  const message = validators[field](form[field])
  errors[field] = hasSubmitted.value ? message : ''
  return !message
}

const handleInput = (field) => {
  loginError.value = ''

  if (hasSubmitted.value) {
    validateField(field)
  }
}

const handleSubmit = async () => {
  hasSubmitted.value = true
  const isValid = Object.keys(validators)
    .map((field) => validateField(field))
    .every(Boolean)

  if (!isValid) {
    return
  }

  isSubmitting.value = true
  const result = await login(form)
  isSubmitting.value = false

  if (!result.success) {
    loginError.value = result.message
    return
  }

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
  router.push(redirect || { name: 'account' })
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <p class="eyebrow">Welcome back</p>
      <h1>Log in to Open Shelf Health</h1>
      <p class="auth-intro">Use the account you created on this device to save health resources and share feedback.</p>

      <div v-if="route.query.reason === 'authentication-required'" class="alert alert-warning" role="status">
        Please log in to view your account.
      </div>
      <div v-if="loginError" class="alert alert-danger" role="alert">{{ loginError }}</div>

      <form novalidate @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label" for="login-email">Email address</label>
          <input
            id="login-email"
            v-model="form.email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            type="email"
            autocomplete="email"
            aria-describedby="login-email-error"
            @input="handleInput('email')"
          />
          <div id="login-email-error" class="invalid-feedback">{{ errors.email }}</div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="login-password">Password</label>
          <input
            id="login-password"
            v-model="form.password"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
            type="password"
            autocomplete="current-password"
            aria-describedby="login-password-error"
            @input="handleInput('password')"
          />
          <div id="login-password-error" class="invalid-feedback">{{ errors.password }}</div>
        </div>

        <button class="btn btn-primary w-100" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Logging in...' : 'Log in' }}
        </button>
      </form>

      <p class="auth-switch">
        New to Open Shelf Health?
        <RouterLink to="/register">Create an account</RouterLink>
      </p>
    </section>
  </main>
</template>
