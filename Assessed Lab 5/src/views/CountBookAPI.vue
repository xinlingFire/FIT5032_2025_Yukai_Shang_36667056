<script setup>
import { onMounted, ref } from 'vue'

const authorsUrl = new URL(
  '../assets/json/authors.json',
  import.meta.url
).href

const apiResponse = ref(null)
const errorMessage = ref('')
const isLoading = ref(false)

const getApiData = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(authorsUrl)

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    const authors = await response.json()
    const totalBooks = authors.reduce(
      (total, author) => total + author.famousWorks.length,
      0
    )

    apiResponse.value = {
      success: true,
      data: {
        authorsCount: authors.length,
        totalBooks,
        authors: authors.map((author) => ({
          name: author.name,
          bookCount: author.famousWorks.length
        }))
      },
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error loading authors data:', error)
    apiResponse.value = null
    errorMessage.value = 'Authors data could not be loaded.'
  } finally {
    isLoading.value = false
  }
}

onMounted(getApiData)

defineExpose({ getApiData })
</script>

<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <section class="card shadow-sm">
          <div class="card-body p-4">
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
              <h1 class="h2 mb-0">Count Book API</h1>
              <button
                type="button"
                class="btn btn-primary"
                :disabled="isLoading"
                @click="getApiData"
              >
                {{ isLoading ? 'Loading...' : 'Refresh API Data' }}
              </button>
            </div>

            <p v-if="isLoading" class="text-secondary mb-0" role="status">
              Loading authors data...
            </p>

            <p v-else-if="errorMessage" class="alert alert-danger mb-0" role="alert">
              {{ errorMessage }}
            </p>

            <div v-else-if="apiResponse" class="api-response">
              <pre class="bg-light border rounded p-3 mb-0"><code>{{ JSON.stringify(apiResponse, null, 2) }}</code></pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
pre {
  max-height: 32rem;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
