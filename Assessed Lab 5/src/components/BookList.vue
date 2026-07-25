<script setup>
import { onMounted, ref } from 'vue'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase/init'

const books = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const fetchBooks = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const booksQuery = query(
      collection(db, 'books'),
      where('isbn', '>', 1000)
    )
    const querySnapshot = await getDocs(booksQuery)

    books.value = querySnapshot.docs.map((book) => ({
      id: book.id,
      ...book.data()
    }))
  } catch (error) {
    console.error('Error fetching books:', error)
    errorMessage.value = 'Books could not be loaded. Check your Firestore connection and rules.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchBooks)
</script>

<template>
  <section class="card shadow-sm mt-4">
    <div class="card-body p-4">
      <h2 class="h3 mb-3">Books with ISBN &gt; 1000</h2>

      <p v-if="isLoading" class="mb-0 text-secondary">Loading books...</p>

      <p v-else-if="errorMessage" class="alert alert-danger mb-0" role="alert">
        {{ errorMessage }}
      </p>

      <p v-else-if="books.length === 0" class="mb-0 text-secondary">
        No books match this query yet.
      </p>

      <ul v-else class="mb-0">
        <li v-for="book in books" :key="book.id">
          {{ book.name }} - ISBN: {{ book.isbn }}
        </li>
      </ul>
    </div>
  </section>
</template>
