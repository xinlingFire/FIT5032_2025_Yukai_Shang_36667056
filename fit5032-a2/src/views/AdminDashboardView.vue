<script setup>
import { computed, ref } from 'vue'
import BookManager from '../components/BookManager.vue'
import { getRegisteredUsers } from '../services/auth'
import { initialiseLibrary } from '../services/libraryStore'

const members = ref(getRegisteredUsers())
const books = ref(initialiseLibrary())

const studentCount = computed(
  () => members.value.filter((member) => member.role === 'student').length
)

const handleBooksChanged = (changedBooks) => {
  books.value = changedBooks
}
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

        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Joined</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in members" :key="member.id">
                <td>{{ member.name }}</td>
                <td>{{ member.email }}</td>
                <td>
                  <span :class="['role-label', `role-${member.role}`]">
                    {{ member.role === 'admin' ? 'Service coordinator' : 'Community member' }}
                  </span>
                </td>
                <td>{{ new Date(member.createdAt).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <BookManager :books="books" @books-changed="handleBooksChanged" />
    </div>
  </main>
</template>
