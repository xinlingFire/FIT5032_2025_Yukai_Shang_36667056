<script setup>
import { ref } from 'vue'
import axios from 'axios'

const books = ref([])
const selectedBook = ref(null)
const errorMessage = ref('')
const isLoading = ref(false)

const booksForSaleUrl =
  import.meta.env.VITE_BOOKS_FOR_SALE_URL ||
  'http://127.0.0.1:5001/week7-yukai/us-central1/getBooksForSale'

const loadBookCatalogue = async () => {
  isLoading.value = true
  errorMessage.value = ''
  selectedBook.value = null

  try {
    const response = await axios.get(booksForSaleUrl)
    books.value = response.data.books
  } catch (error) {
    console.error('Error loading the book catalogue:', error)
    books.value = []
    errorMessage.value = 'The catalogue is unavailable. Start the Functions Emulator and try again.'
  } finally {
    isLoading.value = false
  }
}

const selectBook = (book) => {
  selectedBook.value = book
}
</script>

<template>
  <main class="container py-5">
    <section class="mb-4">
      <h1 class="h2 mb-2">Book Data Store</h1>
      <p class="text-muted mb-3">
        Browse Firestore book data through the secure catalogue cloud function.
      </p>
      <button
        type="button"
        class="btn btn-primary"
        :disabled="isLoading"
        @click="loadBookCatalogue"
      >
        {{ isLoading ? 'Loading catalogue...' : 'Load book catalogue' }}
      </button>
    </section>

    <p v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </p>

    <div v-if="books.length" class="row g-3" aria-live="polite">
      <div v-for="book in books" :key="book.id" class="col-12 col-md-6 col-lg-4">
        <article class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <p class="text-uppercase small text-muted mb-2">Firestore data access</p>
            <h2 class="h5">{{ book.name }}</h2>
            <p class="mb-1">ISBN: {{ book.isbn }}</p>
            <p class="h4 mt-auto mb-3">{{ book.currency }} ${{ book.price.toFixed(2) }}</p>
            <button type="button" class="btn btn-outline-primary" @click="selectBook(book)">
              View data offer
            </button>
          </div>
        </article>
      </div>
    </div>

    <section v-if="selectedBook" class="alert alert-success mt-4 mb-0" role="status">
      Data offer selected: {{ selectedBook.name }} for {{ selectedBook.currency }}
      ${{ selectedBook.price.toFixed(2) }}.
    </section>
  </main>
</template>
