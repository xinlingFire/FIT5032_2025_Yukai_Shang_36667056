<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { currentUser, getRegisteredUsers } from '../services/auth'
import {
  getBookReviews,
  getRatingSummary,
  getUserBookRating,
  isBookFavourite,
  saveBookRating,
  toggleFavourite
} from '../services/engagementStore'

const props = defineProps({
  book: { type: Object, required: true }
})

const reviewForm = reactive({ score: 0, comment: '' })
const error = ref('')
const reviewSaved = ref(false)
const isFavourite = ref(false)
const reviews = ref([])
const summary = ref({ count: 0, average: null })
const reviewerNames = ref(new Map())
const userHasRating = ref(false)

const isStudent = computed(() => currentUser.value?.role === 'student')
const favouriteLabel = computed(() =>
  isFavourite.value ? 'Remove from favourites' : 'Save to favourites'
)
const reviewButtonLabel = computed(() =>
  userHasRating.value ? 'Update review' : 'Save review'
)

const refreshEngagement = () => {
  summary.value = getRatingSummary(props.book.id)
  reviews.value = getBookReviews(props.book.id)
  reviewerNames.value = new Map(getRegisteredUsers().map((user) => [user.id, user.name]))

  if (currentUser.value) {
    const existingRating = getUserBookRating(currentUser.value.id, props.book.id)
    userHasRating.value = Boolean(existingRating)
    reviewForm.score = existingRating?.score ?? 0
    reviewForm.comment = existingRating?.comment ?? ''
    isFavourite.value = isBookFavourite(currentUser.value.id, props.book.id)
  } else {
    reviewForm.score = 0
    reviewForm.comment = ''
    isFavourite.value = false
    userHasRating.value = false
  }
}

const handleFavourite = () => {
  if (currentUser.value) {
    isFavourite.value = toggleFavourite(currentUser.value.id, props.book.id)
  }
}

const handleSubmit = () => {
  error.value = ''
  reviewSaved.value = false

  if (!reviewForm.score) {
    error.value = 'Select a rating from 1 to 5.'
    return
  }

  if (reviewForm.comment.trim().length < 10 || reviewForm.comment.trim().length > 500) {
    error.value = 'Write a review between 10 and 500 characters.'
    return
  }

  saveBookRating({
    bookId: props.book.id,
    userId: currentUser.value.id,
    score: reviewForm.score,
    comment: reviewForm.comment
  })
  refreshEngagement()
  reviewSaved.value = true
}

watch(
  () => [props.book.id, currentUser.value?.id],
  refreshEngagement,
  { immediate: true }
)
</script>

<template>
  <section class="engagement-panel" :aria-labelledby="`reviews-${book.id}`">
    <div class="rating-summary">
      <div>
        <p class="eyebrow">Reader ratings</p>
        <h2 :id="`reviews-${book.id}`">{{ summary.average ?? 'New' }}<span v-if="summary.average">/5</span></h2>
      </div>
      <p>{{ summary.count ? `${summary.count} ${summary.count === 1 ? 'review' : 'reviews'}` : 'No reviews yet' }}</p>
    </div>

    <template v-if="isStudent">
      <button class="favourite-button" type="button" :aria-pressed="isFavourite" @click="handleFavourite">
        <span aria-hidden="true">{{ isFavourite ? '★' : '☆' }}</span>
        {{ favouriteLabel }}
      </button>

      <form class="review-form" novalidate @submit.prevent="handleSubmit">
        <fieldset>
          <legend>Rate this book</legend>
          <div class="score-picker">
            <label v-for="score in 5" :key="score" :class="{ selected: reviewForm.score === score }">
              <input v-model.number="reviewForm.score" type="radio" name="book-score" :value="score" />
              <span>{{ score }}</span>
            </label>
          </div>
        </fieldset>

        <label class="form-label" :for="`review-${book.id}`">Your review</label>
        <textarea
          :id="`review-${book.id}`"
          v-model="reviewForm.comment"
          class="form-control"
          :class="{ 'is-invalid': error }"
          rows="4"
          maxlength="501"
          aria-describedby="review-error"
          @input="error = ''; reviewSaved = false"
        ></textarea>
        <div id="review-error" class="invalid-feedback">{{ error }}</div>

        <p v-if="reviewSaved" class="review-saved" role="status">Your review has been saved.</p>
        <button class="btn btn-primary mt-3" type="submit">{{ reviewButtonLabel }}</button>
      </form>
    </template>

    <p v-else-if="!currentUser" class="engagement-sign-in">
      <RouterLink :to="{ name: 'login', query: { redirect: `/books/${book.id}` } }">Log in</RouterLink>
      to save a favourite or review this book.
    </p>

    <div v-if="reviews.length" class="review-list">
      <article v-for="review in reviews" :key="review.id" class="review-item">
        <div>
          <strong>{{ reviewerNames.get(review.userId) ?? 'Open Shelf reader' }}</strong>
          <span>{{ review.score }}/5</span>
        </div>
        <p>{{ review.comment }}</p>
        <small>{{ new Date(review.updatedAt).toLocaleDateString() }}</small>
      </article>
    </div>
  </section>
</template>
