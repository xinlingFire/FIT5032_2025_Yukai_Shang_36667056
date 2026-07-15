<template>
  <div class="container mt-5">
    <div class="row">
        <div class="col-12 col-md-8 offset-md-2">
        <h1 class="text-center mb-4">
          User Information Form / Credentials
        </h1>

        <form @submit.prevent="submitForm">
            <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="username" class="form-label">Username</label>

              <input
                id="username"
                v-model="formData.username"
                type="text"
                class="form-control"
                @blur="validateName(true)"
                @input="validateName(false)"
              />

              <div v-if="errors.username" class="text-danger">
                {{ errors.username }}
              </div>
            </div>

            <div class="col-md-6 col-sm-6">
              <label for="password" class="form-label">Password</label>

              <input
                id="password"
                v-model="formData.password"
                type="password"
                class="form-control"
                @blur="validatePassword(true)"
                @input="validatePassword(false)"
              />

              <div v-if="errors.password" class="text-danger">
                {{ errors.password }}
              </div>
            </div>
        </div>

         <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <div class="form-check">
                <input
                  id="isAustralian"
                  v-model="formData.isAustralian"
                  type="checkbox"
                  class="form-check-input"
                  @change="validateResident(true)"
                />

                <label class="form-check-label" for="isAustralian">
                  Australian Resident?
                </label>
              </div>

              <div v-if="errors.resident" class="text-danger">
                {{ errors.resident }}
              </div>
            </div>

            <div class="col-md-6 col-sm-6">
              <label for="gender" class="form-label">Gender</label>

              <select
                id="gender"
                v-model="formData.gender"
                class="form-select"
                @change="validateGender(true)"
              >
                <option value="" disabled>Please select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <div v-if="errors.gender" class="text-danger">
                {{ errors.gender }}
              </div>
            </div>
        </div>

        <div class="mb-3">
          <label for="reason" class="form-label">
            Reason for joining
          </label>

          <textarea
            id="reason"
            v-model="formData.reason"
            class="form-control"
            rows="3"
            @blur="validateReason(true)"
            @input="validateReason(false)"
          ></textarea>

          <div v-if="errors.reason" class="text-danger">
            {{ errors.reason }}
          </div>
        </div>

        <div class="text-center">
            <button
              type="submit"
              class="btn btn-primary me-2"
            >
              Submit
            </button>

            <button
              type="button"
              class="btn btn-secondary"
              @click="clearForm"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="submittedCards.length"
      class="row mt-5"
    >
      <div class="d-flex flex-wrap justify-content-start">
        <div
          v-for="(card, index) in submittedCards"
          :key="index"
          class="card m-2"
          style="width: 18rem"
        >
          <div class="card-header">
            User Information
          </div>

          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              Username: {{ card.username }}
            </li>

            <li class="list-group-item">
              Password: {{ card.password }}
            </li>

            <li class="list-group-item">
              Australian Resident:
              {{ card.isAustralian ? 'Yes' : 'No' }}
            </li>

            <li class="list-group-item">
              Gender: {{ card.gender }}
            </li>

            <li class="list-group-item">
              Reason: {{ card.reason }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const createEmptyForm = () => ({
  username: '',
  password: '',
  isAustralian: false,
  reason: '',
  gender: ''
})

const createEmptyErrors = () => ({
  username: null,
  password: null,
  resident: null,
  gender: null,
  reason: null
})

const formData = ref(createEmptyForm())
const errors = ref(createEmptyErrors())
const submittedCards = ref([])

// Username must contain at least 3 characters
const validateName = (blur) => {
  const username = formData.value.username.trim()

  if (username.length < 3) {
    if (blur) {
      errors.value.username =
        'Name must be at least 3 characters'
    }
  } else {
    errors.value.username = null
  }
}

// Password validation
const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8

  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar =
    /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) {
      errors.value.password =
        `Password must be at least ${minLength} characters long.`
    }
  } else if (!hasUppercase) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one uppercase letter.'
    }
  } else if (!hasLowercase) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one lowercase letter.'
    }
  } else if (!hasNumber) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one number.'
    }
  } else if (!hasSpecialChar) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one special character.'
    }
  } else {
    errors.value.password = null
  }
}

// Australian Resident validation
const validateResident = (blur) => {
  if (!formData.value.isAustralian) {
    if (blur) {
      errors.value.resident =
        'Please confirm that you are an Australian resident.'
    }
  } else {
    errors.value.resident = null
  }
}

// Gender validation
const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) {
      errors.value.gender = 'Please select a gender.'
    }
  } else {
    errors.value.gender = null
  }
}

// Reason must contain at least 10 characters
const validateReason = (blur) => {
  const reason = formData.value.reason.trim()

  if (reason.length < 10) {
    if (blur) {
      errors.value.reason =
        'Reason must be at least 10 characters.'
    }
  } else {
    errors.value.reason = null
  }
}

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateResident(true)
  validateGender(true)
  validateReason(true)

  const hasErrors = Object.values(errors.value).some(
    (error) => error !== null
  )

  if (!hasErrors) {
    submittedCards.value.push({
      username: formData.value.username.trim(),
      password: formData.value.password,
      isAustralian: formData.value.isAustralian,
      gender: formData.value.gender,
      reason: formData.value.reason.trim()
    })

    clearForm()
  }
}

const clearForm = () => {
  formData.value = createEmptyForm()
  errors.value = createEmptyErrors()
}
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.list-group-item {
  padding: 10px;
}
</style>
