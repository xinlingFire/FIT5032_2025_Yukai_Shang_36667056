<script setup>
import { computed, ref } from 'vue'

const props = defineProps({ venues: { type: Array, default: () => [] } })
const destination = ref(props.venues[0] ?? '')
const origin = ref('')
const message = ref('')
const tokenConfigured = Boolean(import.meta.env.VITE_MAPBOX_TOKEN)
const mapSearchUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.value)}`)
const directionsUrl = computed(() => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin.value)}&destination=${encodeURIComponent(destination.value)}&travelmode=transit`)
const useLocation = () => {
  message.value = ''
  if (!navigator.geolocation) { message.value = 'Your browser does not support location services.'; return }
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => { origin.value = `${coords.latitude},${coords.longitude}`; message.value = 'Your current location has been added as the route origin.' },
    () => { message.value = 'Location was unavailable. Enter a suburb or address instead.' }
  )
}
</script>
<template>
  <section class="planner-panel" aria-labelledby="planner-heading">
    <p class="eyebrow">Community locations</p><h2 id="planner-heading">Find and plan your visit</h2>
    <p>Search an upcoming workshop venue and plan a public-transport route.</p>
    <div class="planner-grid"><div><label class="form-label" for="planner-destination">Destination</label><select id="planner-destination" v-model="destination" class="form-select"><option v-for="venue in venues" :key="venue" :value="venue">{{ venue }}</option></select></div><div><label class="form-label" for="planner-origin">Starting point</label><input id="planner-origin" v-model="origin" class="form-control" placeholder="Enter suburb or address" /></div></div>
    <div class="planner-actions"><button class="btn btn-outline-secondary" type="button" @click="useLocation">Use my location</button><a class="btn btn-outline-secondary" :href="mapSearchUrl" target="_blank" rel="noreferrer">Search map</a><a class="btn btn-primary" :class="{ disabled: !origin }" :href="origin ? directionsUrl : undefined" target="_blank" rel="noreferrer" @click.prevent="!origin && (message = 'Add a starting point before requesting directions.')">Plan transit route</a></div>
    <p class="status-info" role="status">{{ message || (tokenConfigured ? 'Mapbox token configured; replace the external-map links with your production Mapbox component before deployment.' : 'Map links work without a token. Add VITE_MAPBOX_TOKEN to enable the production Mapbox integration.') }}</p>
  </section>
</template>
