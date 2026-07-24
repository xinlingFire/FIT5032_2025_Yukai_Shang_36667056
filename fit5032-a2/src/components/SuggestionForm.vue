<script setup>
import { reactive, ref } from 'vue'

const SUGGESTIONS_STORAGE_KEY = 'open-shelf-resource-suggestions'

const createEmptyForm = () => ({
  name: '',
  email: '',
  title: '',
  reason: ''
})

const form = reactive(createEmptyForm())
const touched = reactive({
  name: false,
  email: false,
  title: false,
  reason: false
})
const errors = reactive({
  name: '',
  email: '',
  title: '',
  reason: ''
})
const hasSubmitted = ref(false)
const submissionSucceeded = ref(false)

const validators = {
  name(value) {
    return value.trim().length >= 2 ? '' : 'Enter a name with at least 2 characters.'
  },
  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      ? ''
      : 'Enter a valid email address.'
  },
  title(value) {
    return value.trim().length >= 2 ? '' : 'Enter a resource name with at least 2 characters.'
  },
  reason(value) {
    const length = value.trim().length

    if (length < 10) {
      return 'Tell us a little more (at least 10 characters).'
    }

    return length <= 300 ? '' : 'Keep your note to 300 characters or fewer.'
  }
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
  submissionSucceeded.value = false

  if (touched[field] || hasSubmitted.value) {
    validateField(field)
  }
}

const readSuggestions = () => {
  try {
    const storedSuggestions = JSON.parse(
      window.localStorage.getItem(SUGGESTIONS_STORAGE_KEY) ?? '[]'
    )

    return Array.isArray(storedSuggestions) ? storedSuggestions : []
  } catch {
    return []
  }
}

const saveSuggestion = () => {
  const currentSuggestions = readSuggestions()

  currentSuggestions.push({
    id: crypto.randomUUID(),
    name: form.name.trim(),
    email: form.email.trim().toLocaleLowerCase(),
    title: form.title.trim(),
    reason: form.reason.trim(),
    submittedAt: new Date().toISOString()
  })

  window.localStorage.setItem(SUGGESTIONS_STORAGE_KEY, JSON.stringify(currentSuggestions))
}

const handleSubmit = () => {
  hasSubmitted.value = true
  const fields = Object.keys(validators)
  const validationResults = fields.map((field) => validateField(field))
  const isValid = validationResults.every(Boolean)

  if (!isValid) {
    submissionSucceeded.value = false
    return
  }

  saveSuggestion()
  Object.assign(form, createEmptyForm())
  Object.keys(touched).forEach((field) => {
    touched[field] = false
    errors[field] = ''
  })
  hasSubmitted.value = false
  submissionSucceeded.value = true
}
</script>

<template>
  <form class="suggestion-form" novalidate @submit.prevent="handleSubmit">
    <div v-if="submissionSucceeded" class="alert alert-success" role="status">
      Thank you. Your resource suggestion has been saved.
    </div>

    <div class="row g-3">
      <div class="col-12 col-md-6">
        <label class="form-label" for="suggestion-name">Your name</label>
        <input
          id="suggestion-name"
          v-model="form.name"
          class="form-control"
          :class="{ 'is-invalid': errors.name }"
          type="text"
          autocomplete="name"
          aria-describedby="suggestion-name-error"
          @blur="handleBlur('name')"
          @input="handleInput('name')"
        />
        <div id="suggestion-name-error" class="invalid-feedback">{{ errors.name }}</div>
      </div>

      <div class="col-12 col-md-6">
        <label class="form-label" for="suggestion-email">Email address</label>
        <input
          id="suggestion-email"
          v-model="form.email"
          class="form-control"
          :class="{ 'is-invalid': errors.email }"
          type="email"
          autocomplete="email"
          aria-describedby="suggestion-email-error"
          @blur="handleBlur('email')"
          @input="handleInput('email')"
        />
        <div id="suggestion-email-error" class="invalid-feedback">{{ errors.email }}</div>
      </div>

      <div class="col-12">
        <label class="form-label" for="suggestion-title">Resource name</label>
        <input
          id="suggestion-title"
          v-model="form.title"
          class="form-control"
          :class="{ 'is-invalid': errors.title }"
          type="text"
          aria-describedby="suggestion-title-error"
          @blur="handleBlur('title')"
          @input="handleInput('title')"
        />
        <div id="suggestion-title-error" class="invalid-feedback">{{ errors.title }}</div>
      </div>

      <div class="col-12">
        <label class="form-label" for="suggestion-reason">Why could this help the community?</label>
        <textarea
          id="suggestion-reason"
          v-model="form.reason"
          class="form-control"
          :class="{ 'is-invalid': errors.reason }"
          rows="4"
          maxlength="301"
          aria-describedby="suggestion-reason-error"
          @blur="handleBlur('reason')"
          @input="handleInput('reason')"
        ></textarea>
        <div id="suggestion-reason-error" class="invalid-feedback">{{ errors.reason }}</div>
      </div>
    </div>

    <button class="btn btn-primary mt-4" type="submit">Send resource suggestion</button>
  </form>
</template>
