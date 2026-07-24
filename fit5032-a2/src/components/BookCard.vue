<script setup>
defineProps({
  book: {
    type: Object,
    required: true
  },
  ratingSummary: {
    type: Object,
    default: () => ({ count: 0, average: null })
  }
})
</script>

<template>
  <article class="book-card h-100">
    <div class="book-cover" :style="{ '--cover-colour': book.accent }" aria-hidden="true">
      <span>{{ book.title.slice(0, 1) }}</span>
      <small>{{ book.year }}</small>
    </div>
    <div class="book-card-body">
      <p class="book-category">{{ book.category }}</p>
      <h2>{{ book.title }}</h2>
      <p class="book-author">Provided by {{ book.author }}</p>
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
