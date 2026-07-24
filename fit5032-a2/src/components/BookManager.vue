<script setup>
import { computed, reactive, ref } from 'vue'
import { RESOURCE_TYPES, formatWorkshopSchedule, getResourceType, normaliseResourceType } from '../data/resourceTypes'
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
  type: 'guide',
  title: '',
  author: '',
  category: '',
  year: new Date().getFullYear(),
  eventDate: '',
  eventTime: '',
  venue: '',
  accent: '#176a7c',
  description: ''
})

const form = reactive(createEmptyForm())
const errors = reactive({
  type: '',
  title: '',
  author: '',
  category: '',
  year: '',
  eventDate: '',
  eventTime: '',
  venue: '',
  description: ''
})
const touched = reactive({
  type: false,
  title: false,
  author: false,
  category: false,
  year: false,
  eventDate: false,
  eventTime: false,
  venue: false,
  description: false
})
const editorIsOpen = ref(false)
const editingId = ref(null)
const hasSubmitted = ref(false)

const formTitle = computed(() => (editingId.value ? 'Edit resource' : 'Add a resource'))
const selectedType = computed(() => getResourceType(normaliseResourceType(form.type)))
const isWorkshop = computed(() => selectedType.value.value === 'workshop')
const validationFields = computed(() => {
  const baseFields = ['type', 'title', 'author', 'category', 'description']

  return isWorkshop.value
    ? [...baseFields, 'eventDate', 'eventTime', 'venue']
    : [...baseFields, 'year']
})

const validators = {
  type(value) {
    return RESOURCE_TYPES.some((resourceType) => resourceType.value === value)
      ? ''
      : 'Select a resource type.'
  },
  title(value) {
    return value.trim().length >= 2 ? '' : 'Enter a resource name with at least 2 characters.'
  },
  author(value) {
    return value.trim().length >= 2
      ? ''
      : `Enter a ${selectedType.value.contributorLabel.toLocaleLowerCase()} name with at least 2 characters.`
  },
  category(value) {
    return value.trim().length >= 2 ? '' : 'Enter a health topic with at least 2 characters.'
  },
  year(value) {
    const year = Number(value)
    const currentYear = new Date().getFullYear()
    return Number.isInteger(year) && year >= 1900 && year <= currentYear
      ? ''
      : `Enter a year from 1900 to ${currentYear}.`
  },
  eventDate(value) {
    return Number.isNaN(new Date(`${value}T00:00:00`).getTime())
      ? 'Select the workshop date.'
      : ''
  },
  eventTime(value) {
    return value.trim().length >= 2 ? '' : 'Enter the workshop time.'
  },
  venue(value) {
    return value.trim().length >= 2 ? '' : 'Enter the workshop venue.'
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
    type: normaliseResourceType(book.type),
    title: book.title,
    author: book.author,
    category: book.category,
    year: book.year,
    eventDate: book.eventDate ?? '',
    eventTime: book.eventTime ?? '',
    venue: book.venue ?? '',
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

const handleTypeChange = () => {
  handleInput('type')

  if (!isWorkshop.value) {
    ;['eventDate', 'eventTime', 'venue'].forEach((field) => {
      errors[field] = ''
      touched[field] = false
    })
  }
}

const handleSubmit = () => {
  hasSubmitted.value = true
  const isValid = validationFields.value
    .map((field) => validateField(field))
    .every(Boolean)

  if (!isValid) {
    return
  }

  const type = normaliseResourceType(form.type)
  const details = {
    type,
    title: form.title.trim(),
    author: form.author.trim(),
    category: form.category.trim(),
    year: type === 'workshop' ? Number(form.eventDate.slice(0, 4)) : Number(form.year),
    eventDate: type === 'workshop' ? form.eventDate : undefined,
    eventTime: type === 'workshop' ? form.eventTime.trim() : undefined,
    venue: type === 'workshop' ? form.venue.trim() : undefined,
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
        <h2 id="resources-heading">Manage books, guides and workshops</h2>
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
        <div class="col-12 col-md-4">
          <label class="form-label" for="resource-type">Resource type</label>
          <select
            id="resource-type"
            v-model="form.type"
            class="form-select"
            :class="{ 'is-invalid': errors.type }"
            aria-describedby="resource-type-error"
            @change="handleTypeChange"
          >
            <option v-for="resourceType in RESOURCE_TYPES" :key="resourceType.value" :value="resourceType.value">
              {{ resourceType.label }}
            </option>
          </select>
          <div id="resource-type-error" class="invalid-feedback">{{ errors.type }}</div>
        </div>

        <div class="col-12 col-md-8">
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
          <label class="form-label" for="book-author">{{ selectedType.contributorLabel }}</label>
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

        <div class="col-12 col-md-6">
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

        <template v-if="isWorkshop">
          <div class="col-12 col-md-4">
            <label class="form-label" for="workshop-date">Workshop date</label>
            <input
              id="workshop-date"
              v-model="form.eventDate"
              class="form-control"
              :class="{ 'is-invalid': errors.eventDate }"
              type="date"
              aria-describedby="workshop-date-error"
              @blur="handleBlur('eventDate')"
              @input="handleInput('eventDate')"
            />
            <div id="workshop-date-error" class="invalid-feedback">{{ errors.eventDate }}</div>
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label" for="workshop-time">Workshop time</label>
            <input
              id="workshop-time"
              v-model="form.eventTime"
              class="form-control"
              :class="{ 'is-invalid': errors.eventTime }"
              type="text"
              placeholder="6:30 pm - 7:30 pm"
              aria-describedby="workshop-time-error"
              @blur="handleBlur('eventTime')"
              @input="handleInput('eventTime')"
            />
            <div id="workshop-time-error" class="invalid-feedback">{{ errors.eventTime }}</div>
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label" for="workshop-venue">Workshop venue</label>
            <input
              id="workshop-venue"
              v-model="form.venue"
              class="form-control"
              :class="{ 'is-invalid': errors.venue }"
              type="text"
              aria-describedby="workshop-venue-error"
              @blur="handleBlur('venue')"
              @input="handleInput('venue')"
            />
            <div id="workshop-venue-error" class="invalid-feedback">{{ errors.venue }}</div>
          </div>
        </template>

        <div v-else class="col-8 col-md-4">
          <label class="form-label" for="book-year">{{ selectedType.yearLabel }}</label>
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

        <div :class="isWorkshop ? 'col-12 col-md-4' : 'col-4 col-md-2'">
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
            maxlength="500"
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
            <th scope="col">Type</th>
            <th scope="col">Author, provider or host</th>
            <th scope="col">Schedule or year</th>
            <th scope="col"><span class="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in props.books" :key="book.id">
            <td>{{ book.title }}</td>
            <td>{{ getResourceType(normaliseResourceType(book.type)).label }}</td>
            <td>{{ book.author }}</td>
            <td>
              {{ normaliseResourceType(book.type) === 'workshop' ? formatWorkshopSchedule(book, false) : book.year }}
            </td>
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
