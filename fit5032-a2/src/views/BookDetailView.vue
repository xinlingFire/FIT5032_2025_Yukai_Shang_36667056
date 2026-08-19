<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BookEngagementPanel from '../components/BookEngagementPanel.vue'
import HealthSafetyNotice from '../components/HealthSafetyNotice.vue'
import ResourceCover from '../components/ResourceCover.vue'
import WorkshopBooking from '../components/WorkshopBooking.vue'
import { formatWorkshopSchedule, getResourceType, normaliseResourceType } from '../data/resourceTypes'
import { getBookById } from '../services/libraryStore'

const route = useRoute()
const book = computed(() => getBookById(route.params.id))
const resourceType = computed(() => getResourceType(normaliseResourceType(book.value?.type)))
const contributorLine = computed(() =>
  book.value ? `${resourceType.value.contributorLabel}: ${book.value.author}` : ''
)
const metadata = computed(() => {
  if (!book.value) {
    return []
  }

  if (resourceType.value.value === 'workshop') {
    return [
      { label: 'Date and time', value: formatWorkshopSchedule(book.value) },
      { label: 'Location', value: book.value.venue || 'Location to be confirmed' },
      { label: 'Health topic', value: book.value.category }
    ]
  }

  return [
    { label: resourceType.value.yearLabel, value: book.value.year },
    { label: 'Health topic', value: book.value.category }
  ]
})
</script>

<template>
  <main class="container detail-page">
    <RouterLink class="back-link" to="/">&larr; Back to health resources</RouterLink>

    <section v-if="book" class="detail-layout">
      <ResourceCover :resource="book" detail />
      <div class="detail-content">
        <p class="resource-type">{{ resourceType.label }}</p>
        <p class="book-category">{{ book.category }}</p>
        <h1>{{ book.title }}</h1>
        <p class="detail-author">{{ contributorLine }}</p>
        <dl class="book-metadata">
          <div v-for="item in metadata" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
        <p class="detail-description">{{ book.description }}</p>
      </div>
    </section>

    <HealthSafetyNotice v-if="book" />

    <WorkshopBooking v-if="book && normaliseResourceType(book.type) === 'workshop'" :workshop="book" />

    <BookEngagementPanel v-if="book" :key="book.id" :book="book" />

    <section v-else class="empty-state detail-empty">
      <h1>Resource not found</h1>
      <p>The requested health resource is not available in this hub.</p>
      <RouterLink class="btn btn-primary" to="/">Return to health resources</RouterLink>
    </section>
  </main>
</template>
