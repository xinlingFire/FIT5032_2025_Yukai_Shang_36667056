<script setup>
import { computed } from 'vue'
import { formatWorkshopSchedule, getResourceType, normaliseResourceType } from '../data/resourceTypes'
import ResourceCover from './ResourceCover.vue'

const props = defineProps({
  book: {
    type: Object,
    required: true
  },
  ratingSummary: {
    type: Object,
    default: () => ({ count: 0, average: null })
  }
})

const resourceType = computed(() => getResourceType(normaliseResourceType(props.book.type)))
const contributorLine = computed(() => `${resourceType.value.contributorLabel}: ${props.book.author}`)
const workshopLocation = computed(() => props.book.venue || 'Location to be confirmed')
</script>

<template>
  <article class="book-card h-100">
    <ResourceCover :resource="book" />
    <div class="book-card-body">
      <p class="resource-type">{{ resourceType.label }}</p>
      <p class="book-category">{{ book.category }}</p>
      <h2>{{ book.title }}</h2>
      <p class="book-author">{{ contributorLine }}</p>
      <p v-if="resourceType.value === 'workshop'" class="workshop-summary">
        {{ formatWorkshopSchedule(book, true) }}<br />{{ workshopLocation }}
      </p>
      <p class="book-rating">
        <span aria-hidden="true">★</span>
        {{ ratingSummary.average ?? 'New' }}
        <span class="rating-count">{{ ratingSummary.count ? `(${ratingSummary.count})` : 'No feedback yet' }}</span>
      </p>
      <p class="book-summary">{{ book.description }}</p>
      <RouterLink class="book-link" :to="{ name: 'book-detail', params: { id: book.id } }">
        View resource <span aria-hidden="true">&rarr;</span>
      </RouterLink>
    </div>
  </article>
</template>
