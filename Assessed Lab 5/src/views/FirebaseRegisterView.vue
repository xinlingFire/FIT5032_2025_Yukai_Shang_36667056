<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { firebaseAuth } from '../firebase'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const router = useRouter()

const register = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await createUserWithEmailAndPassword(
      firebaseAuth,
      email.value,
      password.value
    )

    await router.push({ name: 'FireLogin' })
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
        <h1 class="mb-4">Create an Account</h1>

        <form @submit.prevent="register">
          <div class="mb-3">
            <label for="registerEmail" class="form-label">Email</label>
            <input
              id="registerEmail"
              v-model="email"
              type="email"
              class="form-control"
              autocomplete="email"
              required
            />
          </div>

          <div class="mb-3">
            <label for="registerPassword" class="form-label">Password</label>
            <input
              id="registerPassword"
              v-model="password"
              type="password"
              class="form-control"
              autocomplete="new-password"
              minlength="6"
              required
            />
          </div>

          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating account...' : 'Save to Firebase' }}
          </button>
        </form>
      </div>
    </div>
  </main>
</template>
