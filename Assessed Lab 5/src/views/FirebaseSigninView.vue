<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { firebaseAuth } from '../firebase'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const router = useRouter()

const signin = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      email.value,
      password.value
    )

    console.log('Firebase Login Successful!')
    console.log('Current Firebase user:', credential.user)

    await router.push({ name: 'home' })
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="container py-4">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <h1 class="mb-4">Sign in</h1>

        <form @submit.prevent="signin">
          <div class="mb-3">
            <label for="firebaseEmail" class="form-label">Email</label>
            <input
              id="firebaseEmail"
              v-model="email"
              type="email"
              class="form-control"
              autocomplete="email"
              required
            />
          </div>

          <div class="mb-3">
            <label for="firebasePassword" class="form-label">Password</label>
            <input
              id="firebasePassword"
              v-model="password"
              type="password"
              class="form-control"
              autocomplete="current-password"
              required
            />
          </div>

          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Signing in...' : 'Sign in via Firebase' }}
          </button>
        </form>
      </div>
    </div>
  </main>
</template>
