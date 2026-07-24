<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BookEngagementPanel from '../components/BookEngagementPanel.vue'
import { getBookById } from '../services/libraryStore'

const route = useRoute()
const book = computed(() => getBookById(route.params.id))
</script>

<template>
  <main class="container detail-page">
    <RouterLink class="back-link" to="/">&larr; Back to catalogue</RouterLink>

    <section v-if="book" class="detail-layout">
      <div class="detail-cover" :style="{ '--cover-colour': book.accent }" aria-hidden="true">
        <span>{{ book.title.slice(0, 1) }}</span>
        <small>{{ book.year }}</small>
      </div>
      <div class="detail-content">
        <p class="book-category">{{ book.category }}</p>
        <h1>{{ book.title }}</h1>
        <p class="detail-author">by {{ book.author }}</p>
        <dl class="book-metadata">
          <div>
            <dt>Published</dt>
            <dd>{{ book.year }}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{{ book.category }}</dd>
          </div>
        </dl>
        <p class="detail-description">{{ book.description }}</p>
      </div>
    </section>

    <BookEngagementPanel v-if="book" :key="book.id" :book="book" />

    <section v-else class="empty-state detail-empty">
      <h1>Book not found</h1>
      <p>The requested book is not available in this catalogue.</p>
      <RouterLink class="btn btn-primary" to="/">Return to catalogue</RouterLink>
    </section>
  </main>
</template>
