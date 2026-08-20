<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const props = defineProps({ venues: { type: Array, default: () => [] } })
const destination = ref(props.venues[0] ?? '')
const origin = ref('')
const message = ref('')
const routeSummary = ref('')
const mapElement = ref(null)
const map = ref(null)
const markers = []
const token = import.meta.env.VITE_MAPBOX_TOKEN
const tokenConfigured = Boolean(token)
const mapSearchUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.value)}`)
const directionsUrl = computed(() => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin.value)}&destination=${encodeURIComponent(destination.value)}&travelmode=transit`)

const geocode = async (query) => {
  const coordinateMatch = String(query).match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/)
  if (coordinateMatch) {
    const latitude = Number(coordinateMatch[1]); const longitude = Number(coordinateMatch[2])
    return { coordinates: [longitude, latitude], label: 'Current location' }
  }
  const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?limit=1&access_token=${encodeURIComponent(token)}`)
  if (!response.ok) throw new Error('Mapbox could not find that place.')
  const data = await response.json()
  const feature = data.features?.[0]
  if (!feature) throw new Error(`No location found for ${query}.`)
  return { coordinates: feature.center, label: feature.place_name }
}

const clearMarkers = () => { markers.splice(0).forEach((marker) => marker.remove()) }
const addRoute = (coordinates) => {
  if (!map.value) return
  const line = { type: 'Feature', geometry: { type: 'LineString', coordinates } }
  const source = map.value.getSource('planned-route')
  if (source) source.setData(line)
  else map.value.addSource('planned-route', { type: 'geojson', data: line })
  if (!map.value.getLayer('planned-route-line')) map.value.addLayer({ id: 'planned-route-line', type: 'line', source: 'planned-route', paint: { 'line-color': '#176a7c', 'line-width': 5 } })
}

const searchPlace = async () => {
  if (!tokenConfigured || !destination.value) return
  try {
    const place = await geocode(destination.value)
    clearMarkers(); markers.push(new mapboxgl.Marker({ color: '#bf4f4f' }).setLngLat(place.coordinates).addTo(map.value))
    map.value.flyTo({ center: place.coordinates, zoom: 13 }); message.value = `Found ${place.label}.`
  } catch (error) { message.value = error.message }
}

const planRoute = async () => {
  if (!origin.value || !destination.value) { message.value = 'Enter a starting point and destination first.'; return }
  if (!tokenConfigured) { message.value = 'Add a Mapbox token to calculate an embedded route.'; return }
  try {
    const [start, end] = await Promise.all([geocode(origin.value), geocode(destination.value)])
    const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${start.coordinates.join(',')};${end.coordinates.join(',')}?geometries=geojson&overview=full&access_token=${encodeURIComponent(token)}`)
    if (!response.ok) throw new Error('Mapbox could not calculate this route.')
    const data = await response.json(); const route = data.routes?.[0]
    if (!route) throw new Error('No route was found for these locations.')
    clearMarkers(); markers.push(new mapboxgl.Marker({ color: '#176a7c' }).setLngLat(start.coordinates).addTo(map.value)); markers.push(new mapboxgl.Marker({ color: '#bf4f4f' }).setLngLat(end.coordinates).addTo(map.value)); addRoute(route.geometry.coordinates)
    map.value.fitBounds([start.coordinates, end.coordinates], { padding: 60 }); routeSummary.value = `${(route.distance / 1000).toFixed(1)} km - about ${Math.round(route.duration / 60)} minutes by road`; message.value = 'Route calculated.'
  } catch (error) { message.value = error.message }
}

const useLocation = () => {
  message.value = ''
  if (!navigator.geolocation) { message.value = 'Your browser does not support location services.'; return }
  navigator.geolocation.getCurrentPosition(({ coords }) => { origin.value = `${coords.latitude},${coords.longitude}`; message.value = 'Your current location has been added as the route origin.' }, () => { message.value = 'Location was unavailable. Enter a suburb or address instead.' })
}

onMounted(() => {
  if (!tokenConfigured || !mapElement.value) return
  mapboxgl.accessToken = token
  map.value = new mapboxgl.Map({ container: mapElement.value, style: 'mapbox://styles/mapbox/streets-v12', center: [144.9631, -37.8136], zoom: 10 })
})
onBeforeUnmount(() => { clearMarkers(); map.value?.remove() })
</script>

<template>
  <section class="planner-panel" aria-labelledby="planner-heading">
    <p class="eyebrow">Community locations</p><h2 id="planner-heading">Find and plan your visit</h2>
    <p>Search a workshop venue and calculate a route with Mapbox.</p>
    <div class="planner-grid"><div><label class="form-label" for="planner-destination">Destination</label><select id="planner-destination" v-model="destination" class="form-select"><option v-for="venue in venues" :key="venue" :value="venue">{{ venue }}</option></select></div><div><label class="form-label" for="planner-origin">Starting point</label><input id="planner-origin" v-model="origin" class="form-control" placeholder="Enter suburb or address" /></div></div>
    <div v-if="tokenConfigured" ref="mapElement" class="mapbox-map" aria-label="Interactive Mapbox map"></div>
    <div class="planner-actions"><button class="btn btn-outline-secondary" type="button" @click="useLocation">Use my location</button><template v-if="tokenConfigured"><button class="btn btn-outline-secondary" type="button" @click="searchPlace">Search place</button><button class="btn btn-primary" type="button" @click="planRoute">Calculate route</button></template><template v-else><a class="btn btn-outline-secondary" :href="mapSearchUrl" target="_blank" rel="noreferrer">Search map</a><a class="btn btn-primary" :class="{ disabled: !origin }" :href="origin ? directionsUrl : undefined" target="_blank" rel="noreferrer" @click.prevent="!origin && (message = 'Add a starting point before requesting directions.')">Plan transit route</a></template></div>
    <p v-if="routeSummary" class="status-success" role="status">{{ routeSummary }}</p><p class="status-info" role="status">{{ message || (tokenConfigured ? 'Mapbox is ready. Search a place or calculate a route.' : 'Mapbox is not configured. Add VITE_MAPBOX_TOKEN to enable the embedded map; external map links remain available.') }}</p>
  </section>
</template>
