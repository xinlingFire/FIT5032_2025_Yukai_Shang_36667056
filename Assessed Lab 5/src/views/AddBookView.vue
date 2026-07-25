<script setup>
import { ref } from 'vue'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase/init'

const isbn = ref('')
const name = ref('')
const isSaving = ref(false)
const feedback = ref('')
const feedbackType = ref('success')

const addBook = async () => {
  const isbnNumber = Number(isbn.value)
  const bookName = name.value.trim()

  if (!bookName || !Number.isFinite(isbnNumber)) {
    feedbackType.value = 'danger'
    feedback.value = 'Please enter a valid ISBN and book name.'
    return
  }

  isSaving.value = true
  feedback.value = ''

  try {
    const bookDocument = await addDoc(collection(db, 'books'), {
      isbn: isbnNumber,
      name: bookName
    })

    isbn.value = ''
    name.value = ''
    feedbackType.value = 'success'
    feedback.value = `Book added successfully (document ID: ${bookDocument.id}).`
  } catch (error) {
    console.error('Error adding book:', error)
    feedbackType.value = 'danger'
    feedback.value = 'The book could not be added. Check your Firestore connection and rules.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <section class="card shadow-sm">
          <div class="card-body p-4">
            <h1 class="h2 mb-4">Add Book</h1>

            <form @submit.prevent="addBook">
              <div class="mb-3">
                <label for="isbn" class="form-label">ISBN</label>
                <input
                  id="isbn"
                  v-model="isbn"
                  type="number"
                  class="form-control"
                  required
                  step="1"
                  inputmode="numeric"
                />
              </div>

              <div class="mb-4">
                <label for="name" class="form-label">Name</label>
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  class="form-control"
                  required
                />
              </div>

              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSaving"
              >
                {{ isSaving ? 'Adding book...' : 'Add Book' }}
              </button>
            </form>

            <p
              v-if="feedback"
              class="alert mt-4 mb-0"
              :class="`alert-${feedbackType}`"
              role="status"
            >
              {{ feedback }}
            </p>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
