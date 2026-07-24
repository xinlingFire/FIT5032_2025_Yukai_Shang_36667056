<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/auth'

const router = useRouter()
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const touched = reactive({
  name: false,
  email: false,
  password: false,
  confirmPassword: false
})
const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const hasSubmitted = ref(false)
const accountError = ref('')
const isSubmitting = ref(false)

const validators = {
  name(value) {
    return value.trim().length >= 2 ? '' : 'Enter a name with at least 2 characters.'
  },
  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      ? ''
      : 'Enter a valid email address.'
  },
  password(value) {
    return value.length >= 8 ? '' : 'Use a password with at least 8 characters.'
  },
  confirmPassword(value) {
    return value === form.password && value.length > 0 ? '' : 'Passwords do not match.'
  }
}

const validateField = (field) => {
  const message = validators[field](form[field])
  errors[field] = touched[field] || hasSubmitted.value ? message : ''
  return !message
}

const handleBlur = (field) => {
  touched[field] = true
  validateField(field)
}

const handleInput = (field) => {
  accountError.value = ''

  if (field === 'password' && (touched.confirmPassword || hasSubmitted.value)) {
    validateField('confirmPassword')
  }

  if (touched[field] || hasSubmitted.value) {
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
  const result = await register(form)
  isSubmitting.value = false

  if (!result.success) {
    accountError.value = result.message
    return
  }

  router.push({ name: 'account' })
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <p class="eyebrow">Open Shelf account</p>
      <h1>Create your account</h1>
      <p class="auth-intro">Save your place in the catalogue and return whenever you are ready.</p>

      <div v-if="accountError" class="alert alert-danger" role="alert">{{ accountError }}</div>

      <form novalidate @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label" for="register-name">Your name</label>
          <input
            id="register-name"
            v-model="form.name"
            class="form-control"
            :class="{ 'is-invalid': errors.name }"
            type="text"
            autocomplete="name"
            aria-describedby="register-name-error"
            @blur="handleBlur('name')"
            @input="handleInput('name')"
          />
          <div id="register-name-error" class="invalid-feedback">{{ errors.name }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label" for="register-email">Email address</label>
          <input
            id="register-email"
            v-model="form.email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            type="email"
            autocomplete="email"
            aria-describedby="register-email-error"
            @blur="handleBlur('email')"
            @input="handleInput('email')"
          />
          <div id="register-email-error" class="invalid-feedback">{{ errors.email }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label" for="register-password">Password</label>
          <input
            id="register-password"
            v-model="form.password"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
            type="password"
            autocomplete="new-password"
            aria-describedby="register-password-error"
            @blur="handleBlur('password')"
            @input="handleInput('password')"
          />
          <div id="register-password-error" class="invalid-feedback">{{ errors.password }}</div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="register-confirm-password">Confirm password</label>
          <input
            id="register-confirm-password"
            v-model="form.confirmPassword"
            class="form-control"
            :class="{ 'is-invalid': errors.confirmPassword }"
            type="password"
            autocomplete="new-password"
            aria-describedby="register-confirm-password-error"
            @blur="handleBlur('confirmPassword')"
            @input="handleInput('confirmPassword')"
          />
          <div id="register-confirm-password-error" class="invalid-feedback">
            {{ errors.confirmPassword }}
          </div>
        </div>

        <button class="btn btn-primary w-100" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating account...' : 'Create account' }}
        </button>
      </form>

      <p class="auth-switch">
        Already have an account?
        <RouterLink to="/login">Log in</RouterLink>
      </p>
    </section>
  </main>
</template>
