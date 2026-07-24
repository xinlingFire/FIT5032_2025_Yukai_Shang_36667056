<script setup>
import { computed, reactive, ref } from 'vue'
import { clearBookEngagement } from '../services/engagementStore'
import { createBook, removeBook, updateBook } from '../services/libraryStore'

const props = defineProps({
  books: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['books-changed'])

const createEmptyForm = () => ({
  title: '',
  author: '',
  category: '',
  year: new Date().getFullYear(),
  accent: '#176a7c',
  description: ''
})

const form = reactive(createEmptyForm())
const errors = reactive({
  title: '',
  author: '',
  category: '',
  year: '',
  description: ''
})
const touched = reactive({
  title: false,
  author: false,
  category: false,
  year: false,
  description: false
})
const editorIsOpen = ref(false)
const editingId = ref(null)
const hasSubmitted = ref(false)

const formTitle = computed(() => (editingId.value ? 'Edit resource' : 'Add a resource'))

const validators = {
  title(value) {
    return value.trim().length >= 2 ? '' : 'Enter a resource name with at least 2 characters.'
  },
  author(value) {
    return value.trim().length >= 2 ? '' : 'Enter a provider name with at least 2 characters.'
  },
  category(value) {
    return value.trim().length >= 2 ? '' : 'Enter a health topic with at least 2 characters.'
  },
  year(value) {
    const year = Number(value)
    const currentYear = new Date().getFullYear()
    return Number.isInteger(year) && year >= 1450 && year <= currentYear
      ? ''
      : `Enter a year from 1900 to ${currentYear}.`
  },
  description(value) {
    const length = value.trim().length
    return length >= 20 && length <= 500
      ? ''
      : 'Use a description between 20 and 500 characters.'
  }
}

const resetValidation = () => {
  hasSubmitted.value = false

  Object.keys(errors).forEach((field) => {
    errors[field] = ''
    touched[field] = false
  })
}

const openCreateEditor = () => {
  Object.assign(form, createEmptyForm())
  editingId.value = null
  resetValidation()
  editorIsOpen.value = true
}

const openEditEditor = (book) => {
  Object.assign(form, {
    title: book.title,
    author: book.author,
    category: book.category,
    year: book.year,
    accent: book.accent,
    description: book.description
  })
  editingId.value = book.id
  resetValidation()
  editorIsOpen.value = true
}

const closeEditor = () => {
  editorIsOpen.value = false
  editingId.value = null
}

const validateField = (field) => {
  const message = validators[field](form[field])
  errors[field] = touched[field] || hasSubmitted.value ? message : ''
  return !message
}

const handleBlur = (field) => {
  touched[field] = true
  validateField(field)
}

const handleInput = (field) => {
  if (touched[field] || hasSubmitted.value) {
    validateField(field)
  }
}

const handleSubmit = () => {
  hasSubmitted.value = true
  const isValid = Object.keys(validators)
    .map((field) => validateField(field))
    .every(Boolean)

  if (!isValid) {
    return
  }

  const details = {
    title: form.title.trim(),
    author: form.author.trim(),
    category: form.category.trim(),
    year: Number(form.year),
    accent: form.accent,
    description: form.description.trim()
  }
  const changedBooks = editingId.value
    ? updateBook(editingId.value, details)
    : createBook(details)

  emit('books-changed', changedBooks)
  closeEditor()
}

const handleDelete = (book) => {
  const shouldDelete = window.confirm(`Remove "${book.title}" from the health resource hub?`)

  if (shouldDelete) {
    clearBookEngagement(book.id)
    emit('books-changed', removeBook(book.id))
  }
}
</script>

<template>
  <section class="admin-table-section" aria-labelledby="resources-heading">
    <div class="admin-section-heading">
      <div>
        <p class="eyebrow">Health resource hub</p>
        <h2 id="resources-heading">Manage resources</h2>
      </div>
      <button class="btn btn-primary" type="button" @click="openCreateEditor">Add resource</button>
    </div>

    <form
      v-if="editorIsOpen"
      class="book-editor"
      data-testid="book-editor"
      aria-label="Health resource editor"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <div class="editor-heading">
        <h3>{{ formTitle }}</h3>
        <button class="btn btn-outline-secondary" type="button" @click="closeEditor">Cancel</button>
      </div>

      <div class="row g-3">
        <div class="col-12 col-md-6">
          <label class="form-label" for="book-title">Resource name</label>
          <input
            id="book-title"
            v-model="form.title"
            class="form-control"
            :class="{ 'is-invalid': errors.title }"
            type="text"
            aria-describedby="book-title-error"
            @blur="handleBlur('title')"
            @input="handleInput('title')"
          />
          <div id="book-title-error" class="invalid-feedback">{{ errors.title }}</div>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="book-author">Provider</label>
          <input
            id="book-author"
            v-model="form.author"
            class="form-control"
            :class="{ 'is-invalid': errors.author }"
            type="text"
            aria-describedby="book-author-error"
            @blur="handleBlur('author')"
            @input="handleInput('author')"
          />
          <div id="book-author-error" class="invalid-feedback">{{ errors.author }}</div>
        </div>

        <div class="col-12 col-md-5">
          <label class="form-label" for="book-category">Health topic</label>
          <input
            id="book-category"
            v-model="form.category"
            class="form-control"
            :class="{ 'is-invalid': errors.category }"
            type="text"
            aria-describedby="book-category-error"
            @blur="handleBlur('category')"
            @input="handleInput('category')"
          />
          <div id="book-category-error" class="invalid-feedback">{{ errors.category }}</div>
        </div>

        <div class="col-8 col-md-4">
          <label class="form-label" for="book-year">Last updated</label>
          <input
            id="book-year"
            v-model="form.year"
            class="form-control"
            :class="{ 'is-invalid': errors.year }"
            type="number"
            min="1900"
            :max="new Date().getFullYear()"
            aria-describedby="book-year-error"
            @blur="handleBlur('year')"
            @input="handleInput('year')"
          />
          <div id="book-year-error" class="invalid-feedback">{{ errors.year }}</div>
        </div>

        <div class="col-4 col-md-3">
          <label class="form-label" for="book-colour">Resource colour</label>
          <input
            id="book-colour"
            v-model="form.accent"
            class="form-control form-control-color"
            type="color"
            title="Choose a cover colour"
          />
        </div>

        <div class="col-12">
          <label class="form-label" for="book-description">Plain-language summary</label>
          <textarea
            id="book-description"
            v-model="form.description"
            class="form-control"
            :class="{ 'is-invalid': errors.description }"
            rows="4"
            maxlength="501"
            aria-describedby="book-description-error"
            @blur="handleBlur('description')"
            @input="handleInput('description')"
          ></textarea>
          <div id="book-description-error" class="invalid-feedback">{{ errors.description }}</div>
        </div>
      </div>

      <button class="btn btn-primary mt-4" type="submit">
        {{ editingId ? 'Save changes' : 'Add resource' }}
      </button>
    </form>

    <div class="table-responsive">
      <table class="table align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Resource</th>
            <th scope="col">Provider</th>
            <th scope="col">Health topic</th>
            <th scope="col">Updated</th>
            <th scope="col"><span class="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in props.books" :key="book.id">
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.category }}</td>
            <td>{{ book.year }}</td>
            <td class="book-actions">
              <button
                class="btn btn-sm btn-outline-secondary"
                type="button"
                :aria-label="`Edit resource: ${book.title}`"
                @click="openEditEditor(book)"
              >
                Edit
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                type="button"
                :aria-label="`Delete resource: ${book.title}`"
                @click="handleDelete(book)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
