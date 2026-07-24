<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser, logout } from '../services/auth'
import { getFavouriteBookIds } from '../services/engagementStore'
import { initialiseLibrary } from '../services/libraryStore'

const router = useRouter()

const favouriteBooks = computed(() => {
  if (currentUser.value?.role !== 'student') {
    return []
  }

  const favouriteBookIds = getFavouriteBookIds(currentUser.value.id)
  return initialiseLibrary().filter((book) => favouriteBookIds.includes(book.id))
})

const handleLogout = () => {
  logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <main class="account-page">
    <div class="account-content">
      <section class="account-card">
        <p class="eyebrow">Your Open Shelf account</p>
        <h1>Welcome, {{ currentUser?.name }}.</h1>
        <p class="account-intro">You are logged in and can continue browsing the catalogue.</p>

        <dl class="account-details">
          <div>
            <dt>Email address</dt>
            <dd>{{ currentUser?.email }}</dd>
          </div>
          <div>
            <dt>Account created</dt>
            <dd>{{ new Date(currentUser?.createdAt).toLocaleDateString() }}</dd>
          </div>
          <div>
            <dt>Access level</dt>
            <dd class="text-capitalize">{{ currentUser?.role }}</dd>
          </div>
        </dl>

        <div class="d-flex flex-wrap gap-3">
          <RouterLink class="btn btn-primary" to="/">Browse catalogue</RouterLink>
          <button class="btn btn-outline-secondary" type="button" @click="handleLogout">Log out</button>
        </div>
      </section>

      <section v-if="currentUser?.role === 'student'" class="account-favourites">
        <p class="eyebrow">Saved books</p>
        <h2>Your favourites</h2>
        <ul v-if="favouriteBooks.length" class="favourite-list">
          <li v-for="book in favouriteBooks" :key="book.id">
            <RouterLink :to="{ name: 'book-detail', params: { id: book.id } }">
              <span>{{ book.title }}</span>
              <small>{{ book.author }}</small>
            </RouterLink>
          </li>
        </ul>
        <p v-else class="empty-favourites">Save books from their detail pages to find them here.</p>
      </section>
    </div>
  </main>
</template>
