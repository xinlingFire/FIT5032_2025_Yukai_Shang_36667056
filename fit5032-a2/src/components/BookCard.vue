<script setup>
defineProps({
  book: {
    type: Object,
    required: true
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
      <p class="book-author">{{ book.author }}</p>
      <p class="book-summary">{{ book.description }}</p>
      <RouterLink class="book-link" :to="{ name: 'book-detail', params: { id: book.id } }">
        View details <span aria-hidden="true">&rarr;</span>
      </RouterLink>
    </div>
  </article>
</template>
