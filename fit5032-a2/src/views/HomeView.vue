<script setup>
import { computed, ref } from 'vue'
import BookCard from '../components/BookCard.vue'
import CatalogFilters from '../components/CatalogFilters.vue'
import { initialiseLibrary } from '../services/libraryStore'

const books = ref(initialiseLibrary())
const searchTerm = ref('')
const selectedCategory = ref('')

const categories = computed(() =>
  [...new Set(books.value.map((book) => book.category))].sort()
)

const filteredBooks = computed(() => {
  const normalisedSearch = searchTerm.value.trim().toLocaleLowerCase()

  return books.value.filter((book) => {
    const matchesSearch =
      !normalisedSearch ||
      book.title.toLocaleLowerCase().includes(normalisedSearch) ||
      book.author.toLocaleLowerCase().includes(normalisedSearch)
    const matchesCategory =
      !selectedCategory.value || book.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})

const resetFilters = () => {
  searchTerm.value = ''
  selectedCategory.value = ''
}
</script>

<template>
  <main>
    <section class="catalogue-hero">
      <div class="container">
        <p class="eyebrow">Discover your next read</p>
        <h1>Books for curious minds.</h1>
        <p class="hero-copy">
          Browse a considered collection of fiction, ideas and practical knowledge from Open Shelf.
        </p>
      </div>
    </section>

    <section class="container catalogue-section">
      <CatalogFilters
        v-model:search-term="searchTerm"
        v-model:selected-category="selectedCategory"
        :categories="categories"
        :result-count="filteredBooks.length"
        @reset="resetFilters"
      />

      <div v-if="filteredBooks.length" class="row g-4 mt-1">
        <div v-for="book in filteredBooks" :key="book.id" class="col-12 col-sm-6 col-lg-4 col-xl-3">
          <BookCard :book="book" />
        </div>
      </div>

      <div v-else class="empty-state">
        <h2>No matching books</h2>
        <p>Try a different title, author or category.</p>
        <button class="btn btn-primary" type="button" @click="resetFilters">Show all books</button>
      </div>
    </section>

    <section id="about" class="about-band">
      <div class="container about-content">
        <p class="eyebrow">About Open Shelf</p>
        <h2>A simple catalogue, designed for exploration.</h2>
        <p>
          This first release focuses on dynamic book discovery. Personal accounts, reviews and ratings will be added in later stages.
        </p>
      </div>
    </section>
  </main>
</template>
