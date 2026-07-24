<script setup>
import { computed, ref } from 'vue'
import BookCard from '../components/BookCard.vue'
import CatalogFilters from '../components/CatalogFilters.vue'
import HealthSafetyNotice from '../components/HealthSafetyNotice.vue'
import SuggestionForm from '../components/SuggestionForm.vue'
import communityHealthWorkshop from '../assets/community-health-workshop.jpg'
import { getRatingSummaries } from '../services/engagementStore'
import { initialiseLibrary } from '../services/libraryStore'

const books = ref(initialiseLibrary())
const searchTerm = ref('')
const selectedCategory = ref('')
const ratingSummaries = ref(getRatingSummaries())

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
      <img
        class="hero-image"
        :src="communityHealthWorkshop"
        alt="Community members joining a health information workshop"
      />
      <div class="container">
        <p class="eyebrow">For people new to Australia</p>
        <h1>Find health information you can use.</h1>
        <p class="hero-copy">
          Open Shelf Health Connect brings together clear starting points for understanding health services,
          wellbeing and support in your new community.
        </p>
      </div>
    </section>

    <section class="container catalogue-section">
      <HealthSafetyNotice />

      <CatalogFilters
        v-model:search-term="searchTerm"
        v-model:selected-category="selectedCategory"
        :categories="categories"
        :result-count="filteredBooks.length"
        @reset="resetFilters"
      />

      <div v-if="filteredBooks.length" class="row g-4 mt-1">
        <div v-for="book in filteredBooks" :key="book.id" class="col-12 col-sm-6 col-lg-4 col-xl-3">
          <BookCard :book="book" :rating-summary="ratingSummaries[book.id]" />
        </div>
      </div>

      <div v-else class="empty-state">
        <h2>No matching resources</h2>
        <p>Try a different resource name, provider or health topic.</p>
        <button class="btn btn-primary" type="button" @click="resetFilters">Show all resources</button>
      </div>
    </section>

    <section id="suggest" class="suggestion-band">
      <div class="container suggestion-layout">
        <div class="suggestion-intro">
          <p class="eyebrow">Shape the resource hub</p>
          <h2>Suggest a health resource.</h2>
          <p>
            Tell Open Shelf Health Connect about a trusted resource that could help people settling into Australia.
          </p>
        </div>
        <SuggestionForm />
      </div>
    </section>

    <section id="about" class="about-band">
      <div class="container about-content">
        <p class="eyebrow">About Open Shelf Health Connect</p>
        <h2>Clear health resources for new community members.</h2>
        <p>
          We help newly arrived migrants find general health information, save useful resources and share feedback
          with the community.
        </p>
      </div>
    </section>
  </main>
</template>
