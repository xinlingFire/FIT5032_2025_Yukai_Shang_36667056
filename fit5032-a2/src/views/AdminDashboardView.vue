<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import BookManager from '../components/BookManager.vue'
import BulkEmailPanel from '../components/BulkEmailPanel.vue'
import InteractiveTable from '../components/InteractiveTable.vue'
import { getRegisteredUsers } from '../services/auth'
import { getBookings } from '../services/bookingStore'
import { getRatingSummaries } from '../services/engagementStore'
import { initialiseLibrary } from '../services/libraryStore'

const members = ref(getRegisteredUsers())
const books = ref(initialiseLibrary())
const bookings = ref(getBookings())
const ratings = ref(getRatingSummaries())

const studentCount = computed(
  () => members.value.filter((member) => member.role === 'student').length
)

const handleBooksChanged = (changedBooks) => {
  books.value = changedBooks
}

const memberRows = computed(() => members.value.map((member) => ({
  ...member,
  roleLabel: member.role === 'admin' ? 'Service coordinator' : 'Community member',
  joined: new Date(member.createdAt).toLocaleDateString()
})))
const resourceRows = computed(() => books.value.map((book) => ({
  id: book.id, title: book.title, type: book.type, provider: book.author,
  topic: book.category, rating: ratings.value[book.id]?.average ?? 'No ratings'
})))
const engagementRows = computed(() => books.value.map((book) => ({
  id: book.id, resource: book.title, bookings: bookings.value.filter((booking) => booking.workshopId === book.id).reduce((sum, booking) => sum + booking.seats, 0),
  ratings: ratings.value[book.id]?.count ?? 0, average: ratings.value[book.id]?.average ?? '—'
})))
const topEngagement = computed(() => Math.max(1, ...engagementRows.value.map((row) => row.bookings + row.ratings)))
const refreshDashboard = () => { books.value = initialiseLibrary(); members.value = getRegisteredUsers(); bookings.value = getBookings(); ratings.value = getRatingSummaries() }
onMounted(() => window.addEventListener('library:updated', refreshDashboard))
onUnmounted(() => window.removeEventListener('library:updated', refreshDashboard))
onMounted(() => window.addEventListener('bookings:updated', refreshDashboard))
onUnmounted(() => window.removeEventListener('bookings:updated', refreshDashboard))
</script>

<template>
  <main class="admin-page">
    <div class="container">
      <p class="eyebrow">Service coordinator area</p>
      <h1>Health resource management centre</h1>
      <p class="admin-intro">Review the current health resources and registered community at a glance.</p>

      <section class="admin-stats" aria-label="Health resource overview">
        <article class="admin-stat">
          <span>Health resources</span>
          <strong>{{ books.length }}</strong>
        </article>
        <article class="admin-stat">
          <span>Registered community members</span>
          <strong>{{ studentCount }}</strong>
        </article>
        <article class="admin-stat">
          <span>Service coordinator accounts</span>
          <strong>{{ members.length - studentCount }}</strong>
        </article>
      </section>

      <section class="admin-table-section" aria-labelledby="members-heading">
        <div class="admin-section-heading">
          <div>
            <p class="eyebrow">Accounts</p>
            <h2 id="members-heading">Registered community members</h2>
          </div>
          <span>{{ members.length }} total</span>
        </div>

        <InteractiveTable title="Community members" filename="community-members" :rows="memberRows" :columns="[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'roleLabel', label: 'Role' }, { key: 'joined', label: 'Joined' }]" />
      </section>

      <section class="admin-table-section" aria-labelledby="analytics-heading">
        <div class="admin-section-heading"><div><p class="eyebrow">F.1 innovation</p><h2 id="analytics-heading">Engagement analytics</h2></div></div>
        <div class="engagement-chart" role="img" aria-label="Resource engagement chart showing bookings and ratings">
          <div v-for="row in engagementRows" :key="row.id" class="chart-row"><span>{{ row.resource }}</span><div class="chart-track"><span class="chart-bar" :style="{ width: `${((row.bookings + row.ratings) / topEngagement) * 100}%` }"></span></div><strong>{{ row.bookings }} bookings · {{ row.ratings }} ratings</strong></div>
        </div>
        <InteractiveTable title="Resource engagement" filename="resource-engagement" :rows="engagementRows" :columns="[{ key: 'resource', label: 'Resource' }, { key: 'bookings', label: 'Booked seats' }, { key: 'ratings', label: 'Ratings' }, { key: 'average', label: 'Average rating' }]" />
      </section>

      <BulkEmailPanel :members="members" />

      <BookManager :books="books" @books-changed="handleBooksChanged" />
    </div>
  </main>
</template>
