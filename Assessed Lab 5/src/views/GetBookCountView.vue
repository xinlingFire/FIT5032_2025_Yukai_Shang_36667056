<script setup>
import { ref } from 'vue'
import axios from 'axios'

const count = ref(null)
const errorMessage = ref('')
const isLoading = ref(false)

const countBooksUrl =
  import.meta.env.VITE_COUNT_BOOKS_URL ||
  'http://127.0.0.1:5001/week7-yukai/us-central1/countBooks'

const getBookCount = async () => {
  isLoading.value = true
  count.value = null
  errorMessage.value = ''

  try {
    const response = await axios.get(countBooksUrl)
    count.value = response.data.count
  } catch (error) {
    console.error('Error getting book count:', error)
    errorMessage.value = 'error'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <section class="card shadow-sm">
          <div class="card-body p-4">
            <h1 class="h2 mb-4">Book Counter</h1>

            <button
              type="button"
              class="btn btn-primary"
              :disabled="isLoading"
              @click="getBookCount"
            >
              {{ isLoading ? 'Loading...' : 'Get Book Count' }}
            </button>

            <p v-if="count !== null" class="mt-4 mb-0" role="status">
              Total number of books: {{ count }}
            </p>
            <p v-else-if="errorMessage" class="mt-4 mb-0 text-danger" role="alert">
              {{ errorMessage }}
            </p>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
