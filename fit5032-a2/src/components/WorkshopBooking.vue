<script setup>
import { computed, ref } from 'vue'
import { currentUser, isAuthenticated } from '../services/auth'
import { createBooking, getBookingCount } from '../services/bookingStore'
const props = defineProps({ workshop: Object })
const seats = ref(1); const message = ref(''); const error = ref('')
const capacity = computed(() => Number(props.workshop.capacity ?? 20))
const remaining = computed(() => Math.max(0, capacity.value - getBookingCount(props.workshop.id)))
const book = () => { error.value = ''; message.value = ''; try { createBooking({ workshop: props.workshop, user: currentUser.value, seats: seats.value }); message.value = 'Your place has been reserved. Check your account email for the workshop details.' } catch (reason) { error.value = reason.message } }
</script>
<template><section class="booking-panel" aria-labelledby="booking-heading"><h2 id="booking-heading">Reserve a workshop place</h2><p>{{ remaining }} of {{ capacity }} seats currently available.</p><RouterLink v-if="!isAuthenticated" class="btn btn-primary" :to="{ name: 'login', query: { redirect: $route.fullPath } }">Log in to reserve</RouterLink><form v-else @submit.prevent="book"><label class="form-label" for="booking-seats">Seats</label><select id="booking-seats" v-model.number="seats" class="form-select"><option v-for="number in 4" :key="number" :value="number">{{ number }}</option></select><button class="btn btn-primary mt-3" type="submit" :disabled="remaining === 0">Reserve place</button></form><p v-if="message" class="status-success" role="status">{{ message }}</p><p v-if="error" class="status-error" role="alert">{{ error }}</p></section></template>
