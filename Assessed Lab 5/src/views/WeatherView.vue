<script setup>
import { computed, ref } from 'vue'
import axios from 'axios'

const city = ref('')
const weatherData = ref(null)
const errorMessage = ref('')
const isLoading = ref(false)
const loadingAction = ref('')

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

const weatherIconUrl = computed(() => {
  const iconCode = weatherData.value?.weather?.[0]?.icon

  return iconCode
    ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    : ''
})

const resetWeatherState = () => {
  weatherData.value = null
  errorMessage.value = ''
}

const getApiErrorMessage = (error, fallbackMessage) => {
  if (error.response?.status === 401) {
    return 'The weather API key is invalid or has not been activated yet.'
  }

  if (error.response?.status === 404) {
    return fallbackMessage
  }

  return 'Weather data could not be loaded. Check your connection and try again.'
}

const searchByCity = async () => {
  const cityName = city.value.trim()

  resetWeatherState()

  if (!cityName) {
    errorMessage.value = 'Enter a city name before searching.'
    return
  }

  if (!apiKey) {
    errorMessage.value = 'The weather API key is missing. Add it to .env.local and restart the dev server.'
    return
  }

  isLoading.value = true
  loadingAction.value = 'search'

  try {
    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: cityName,
          appid: apiKey,
          units: 'metric'
        }
      }
    )

    weatherData.value = response.data
  } catch (error) {
    console.error('Error fetching weather data:', error)
    errorMessage.value = getApiErrorMessage(
      error,
      `No weather data was found for "${cityName}".`
    )
  } finally {
    isLoading.value = false
    loadingAction.value = ''
  }
}

const getCurrentLocationWeather = async () => {
  resetWeatherState()

  if (!apiKey) {
    errorMessage.value = 'The weather API key is missing. Add it to .env.local and restart the dev server.'
    return
  }

  if (!navigator.geolocation) {
    errorMessage.value = 'Location services are not supported by this browser.'
    return
  }

  isLoading.value = true
  loadingAction.value = 'location'

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000
      })
    })

    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          appid: apiKey,
          units: 'metric'
        }
      }
    )

    weatherData.value = response.data
    city.value = response.data.name
  } catch (error) {
    console.error('Error fetching location weather:', error)

    if (error.code === 1) {
      errorMessage.value = 'Location permission was denied. Allow location access and try again.'
    } else if (error.code === 2) {
      errorMessage.value = 'Your location could not be determined. Try again or search by city.'
    } else if (error.code === 3) {
      errorMessage.value = 'Location request timed out. Try again or search by city.'
    } else {
      errorMessage.value = getApiErrorMessage(
        error,
        'Weather data could not be found for your current location.'
      )
    }
  } finally {
    isLoading.value = false
    loadingAction.value = ''
  }
}
</script>

<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <section class="card shadow-sm">
          <div class="card-body p-4">
            <h1 class="h2 mb-4">Weather App</h1>

            <form @submit.prevent="searchByCity">
              <label for="city" class="form-label">City</label>
              <div class="input-group">
                <input
                  id="city"
                  v-model="city"
                  type="text"
                  class="form-control"
                  placeholder="Enter city name"
                  autocomplete="address-level2"
                  :disabled="isLoading"
                />
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isLoading"
                >
                  {{ loadingAction === 'search' ? 'Searching...' : 'Search' }}
                </button>
              </div>
            </form>

            <button
              type="button"
              class="btn btn-outline-primary mt-3"
              :disabled="isLoading"
              @click="getCurrentLocationWeather"
            >
              {{ loadingAction === 'location' ? 'Getting location...' : 'Use My Location' }}
            </button>

            <p
              v-if="errorMessage"
              class="alert alert-danger mt-4 mb-0"
              role="alert"
            >
              {{ errorMessage }}
            </p>

            <section
              v-else-if="weatherData"
              class="border rounded p-3 mt-4"
              aria-live="polite"
            >
              <h2 class="h4 mb-3">
                {{ weatherData.name }}, {{ weatherData.sys.country }}
              </h2>
              <div class="d-flex align-items-center gap-2">
                <img
                  :src="weatherIconUrl"
                  :alt="weatherData.weather[0].description"
                  width="80"
                  height="80"
                />
                <div>
                  <p class="display-6 mb-0">{{ Math.round(weatherData.main.temp) }} °C</p>
                  <p class="text-capitalize mb-0">{{ weatherData.weather[0].description }}</p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
