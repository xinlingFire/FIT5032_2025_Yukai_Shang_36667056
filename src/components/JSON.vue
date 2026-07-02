<!-- JSONLab.vue -->
<template>
  <div class="json-lab">
    <h1>🗄️ JSON Data & Vue Directives Lab</h1>

    <section class="lab-section">
      <h2>📚 Working with JSON Arrays</h2>
      <p>Our <code>authors.json</code> contains an array of author objects.</p>

      <h3>Iterating through Arrays</h3>
      <!-- Activity 6: Render a list containing author names and their birth years. Hint: Make use of the v-for directive to iterate through the array of authors. -->
      <!-- TODO: CODE TO RENDER LIST OF AUTHORS HERE -->
      <ul>
        <li
          v-for="author in authors"
          :key="author.id"
          :title="
            author.name === 'George Orwell'
              ? 'Highlighted author: George Orwell'
              : `Author: ${author.name}`
          "
          :class="{
            highlight: author.name === 'George Orwell',
          }"
          :style="{
            color: author.name === 'George Orwell' ? 'white' : '#333',
            fontWeight:
              author.name === 'George Orwell' ? 'bold' : 'normal',
            border:
              author.name === 'George Orwell'
                ? '2px solid #237a57'
                : '2px solid transparent',
          }"
        >
          {{ author.name }} ({{ author.birthYear }})
        </li>
      </ul>

      <h3>Filtering Arrays</h3>
      <!-- Activity 7: Render a list containing authors born after 1850. Hint: Make use of the v-for directive to iterate through the array of authors that you have filtered out. -->
      <p>Authors born after 1850:</p>
      <!-- TODO: CODE TO RENDER LIST OF AUTHORS HERE -->
      <ul>
        <li
          v-for="author in modernAuthors"
          :key="author.id"
          :title="
            author.name === 'George Orwell'
              ? 'Highlighted author: George Orwell'
              : `Author: ${author.name}`
          "
          :class="{
            highlight: author.name === 'George Orwell',
          }"
          :style="{
            color: author.name === 'George Orwell' ? 'white' : '#333',
            fontWeight:
              author.name === 'George Orwell' ? 'bold' : 'normal',
            border:
              author.name === 'George Orwell'
                ? '2px solid #237a57'
                : '2px solid transparent',
          }"
        >
          {{ author.name }} ({{ author.birthYear }})
        </li>
      </ul>

      <h3>Mapping Arrays</h3>
      <p>Famous works:</p>
      <ul>
        <!-- Activity 8: Render a list of all famous works. Hint: Use the v-for directive to iterate through the array of authors that you have filtered out. -->
        <!-- TODO: CODE TO RENDER LIST OF FAMOUS WORKS HERE -->
        <li v-for="work in allFamousWorks" :key="work">
          {{ work }}
        </li>
      </ul>

      <h3>Finding in Arrays</h3>
      <p>
        Finding by property:
        <span
          v-if="orwell"
          class="author-result"
          :title="
            orwell.name === 'George Orwell'
              ? 'Highlighted author: George Orwell'
              : `Author: ${orwell.name}`
          "
          :class="{
            highlight: orwell.name === 'George Orwell',
          }"
          :style="{
            color: orwell.name === 'George Orwell' ? 'white' : '#333',
            fontWeight:
              orwell.name === 'George Orwell' ? 'bold' : 'normal',
            border:
              orwell.name === 'George Orwell'
                ? '2px solid #237a57'
                : '2px solid transparent',
          }"
        >
          {{ orwell.name }}
        </span>
      </p>

      <h3>Nested Arrays/Objects</h3>
      <p>{{ austen?.name }}'s works:</p>
      <!-- Activity 9: Render a list of Austen's works. Hint: Use the v-for directive to iterate through the array of authors that you have filtered out. -->
      <!-- TODO: CODE TO RENDER LIST OF AUSTEN'S WORKS HERE -->
      <ul>
        <li
          v-for="work in austen?.famousWorks || []"
          :key="work.title"
        >
          {{ work.title }}
        </li>
      </ul>
    </section>

    <section class="lab-section">
      <h2>🏢 Working with JSON Objects</h2>
      <p>Our <code>bookstores.json</code> is a JSON object.</p>

      <h3>Accessing Properties</h3>
      <p>
        Company:
        <!-- Activity 9a: Get the company name from the bookstores object. -->
        <!-- TODO: CODE TO GET COMPANY NAME HERE -->
        {{ companyName }}
      </p>

      <p>
        Total Stores:
        <!-- Activity 9b: Get the total number of stores from the bookstores object. -->
        <!-- TODO: CODE TO GET TOTAL STORES HERE -->
        {{ bookstores.totalStores }}
      </p>

      <h3>Iterating Object Properties</h3>
      <p>Store Types:</p>
      <!-- Activity 10: Iterate through the storeTypes array and display the store type and the number of stores that use that type. -->
      <!-- TODO: CODE TO RENDER LIST OF STORE TYPES HERE -->
      <ul>
        <li
          v-for="storeType in storeTypeEntries"
          :key="`${storeType.type}-${storeType.count}`"
        >
          {{ storeType.type }}
          <span v-if="storeType.count !== ''">
            : {{ storeType.count }}
          </span>
        </li>
      </ul>

      <h3>Nested Objects</h3>
      <p>Opening Hours:</p>
      <!-- Activity 11: Iterate through the openingHours object and display the day of the week and the opening and closing times. -->
      <!-- TODO: CODE TO RENDER LIST OF OPENING HOURS HERE -->
      <ul>
        <li
          v-for="(hours, day) in bookstores.openingHours"
          :key="day"
        >
          {{ day }}: {{ hours.open }} - {{ hours.close }}
        </li>
      </ul>

      <h3>Working with Arrays in Objects</h3>
      <!-- Activity 12: Get the top sellers from the bookstores object. -->
      <!-- TODO: CODE TO GET TOP SELLERS HERE -->
      <p>We operate in:</p>

      <ul>
        <li
          v-for="location in operatingLocations"
          :key="location"
        >
          {{ location }}
        </li>
      </ul>

      <p>
        Our #1 seller:
        {{ numberOneSeller }}
      </p>
    </section>

    <section class="lab-section">
      <h2>v-if & v-else</h2>
      <p>Toggle visibility based on a condition.</p>

      <!-- Activity 13: Toggle the message visibility when the button is clicked. -->
      <!-- TODO: CODE TO TOGGLE MESSAGE VISIBILITY HERE. Hint: Use the v-if directive. -->
      <button @click="showMessage = !showMessage">
        Toggle Message
      </button>

      <p v-if="showMessage" class="message success">
        ✨ You're a Vue superstar! ✨
      </p>

      <p v-else class="message">
        Click the button to see a message.
      </p>
    </section>

    <section class="lab-section">
      <h2>
        Attribute, Class and Style Binding with
        <code>v-bind</code>
      </h2>

      <p>Highlighting Specific Authors:</p>

      <ul>
        <li
          v-for="author in authors"
          :key="author.id"
          :title="
            author.name === 'George Orwell'
              ? 'Highlighted author: George Orwell'
              : `Author: ${author.name}`
          "
          :class="{
            highlight: author.name === 'George Orwell',
          }"
          :style="{
            color: author.name === 'George Orwell' ? 'white' : '#333',
            fontWeight:
              author.name === 'George Orwell' ? 'bold' : 'normal',
            border:
              author.name === 'George Orwell'
                ? '2px solid #237a57'
                : '2px solid transparent',
          }"
        >
          {{ author.name }} ({{ author.birthYear }})
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import authors from '../assets/json/authors.json'
import bookstores from '../assets/json/bookstores.json'

// Activity 1: Import JSON files (authors.json and bookstores.json)
// TODO: CODE TO IMPORT JSON FILES HERE

const showMessage = ref(false)

// Activity 2: Get authors born after 1850
const modernAuthors = computed(() => {
  // TODO: CODE TO FILTER ARRAY OF AUTHORS HERE
  return authors.filter((author) => author.birthYear > 1850)
})

// Activity 3: Get all famous works
const allFamousWorks = computed(() => {
  // TODO: CODE TO GET ALL FAMOUS WORKS HERE
  return authors.flatMap((author) =>
    author.famousWorks.map((work) => work.title),
  )
})

// Activity 4: Find author by name
const orwell = computed(() => {
  // TODO: CODE TO FIND AUTHOR BY NAME HERE
  return authors.find(
    (author) => author.name === 'George Orwell',
  )
})

// Activity 5: Find author by ID
const austen = computed(() => {
  // TODO: CODE TO FIND AUTHOR BY ID HERE
  return authors.find((author) => author.id === 1)
})

const companyName = computed(() => {
  const matchingCompanyProperty = Object.entries(
    bookstores,
  ).find(
    ([propertyName, propertyValue]) =>
      typeof propertyValue === 'string' &&
      /(company|name)/i.test(propertyName),
  )

  return (
    bookstores.company ??
    bookstores.companyName ??
    bookstores.name ??
    matchingCompanyProperty?.[1] ??
    ''
  )
})

const storeTypeEntries = computed(() => {
  const storeTypes = bookstores.storeTypes ?? []

  if (!Array.isArray(storeTypes)) {
    return Object.entries(storeTypes).map(
      ([type, count]) => ({
        type,
        count,
      }),
    )
  }

  return storeTypes.map((storeType, index) => {
    if (typeof storeType === 'string') {
      return {
        type: storeType,
        count: '',
      }
    }

    const properties = Object.entries(storeType)

    const type =
      storeType.type ??
      storeType.name ??
      storeType.storeType ??
      properties.find(
        ([, value]) => typeof value === 'string',
      )?.[1] ??
      `Store type ${index + 1}`

    const count =
      storeType.count ??
      storeType.total ??
      storeType.numberOfStores ??
      storeType.storeCount ??
      properties.find(
        ([, value]) => typeof value === 'number',
      )?.[1] ??
      ''

    return {
      type,
      count,
    }
  })
})

const operatingLocations = computed(() => {
  const locations =
    bookstores.locations ??
    bookstores.countries ??
    bookstores.operatingCountries ??
    bookstores.cities ??
    bookstores.operatesIn ??
    bookstores.operatingLocations ??
    bookstores.regions ??
    []

  if (Array.isArray(locations)) {
    return locations.map((location) => {
      if (typeof location === 'string') {
        return location
      }

      return (
        location.name ??
        location.country ??
        location.city ??
        location.location ??
        JSON.stringify(location)
      )
    })
  }

  return Object.values(locations)
})

const numberOneSeller = computed(() => {
  const matchingSellerProperty = Object.entries(
    bookstores,
  ).find(([propertyName]) =>
    /(top.*seller|best.*seller|seller)/i.test(
      propertyName,
    ),
  )

  const sellers =
    bookstores.topSellers ??
    bookstores.bestSellers ??
    bookstores.bestsellers ??
    bookstores.topSellingBooks ??
    bookstores.topSeller ??
    bookstores.bestSeller ??
    matchingSellerProperty?.[1] ??
    []

  const firstSeller = Array.isArray(sellers)
    ? sellers[0]
    : sellers

  if (!firstSeller) {
    return ''
  }

  if (typeof firstSeller === 'string') {
    return firstSeller
  }

  return (
    firstSeller.title ??
    firstSeller.name ??
    firstSeller.book ??
    ''
  )
})
</script>

<style scoped>
.json-lab {
  font-family:
    'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  color: #222;
  background-color: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.json-lab p,
.json-lab h3,
.json-lab li {
  color: #222;
}

h1,
h2 {
  color: #333;
}

h1 {
  text-align: center;
}

.lab-section {
  margin-bottom: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  padding: 8px 14px;
  font-size: 16px;
  cursor: pointer;
}

.message {
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
}

.json-lab .success {
  color: #237a57;
  background-color: #e7faf3;
  border: 1px solid #42b883;
}

.highlight {
  background-color: #42b883;
  transform: scale(1.01);
  box-shadow: 0 3px 8px rgba(66, 184, 131, 0.3);
}

.author-result {
  display: inline-block;
  margin-left: 6px;
  padding: 4px 10px;
  border-radius: 5px;
}

code {
  padding: 2px 5px;
  background-color: #e0e0e0;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
}

ul {
  padding: 0;
  list-style-type: none;
}

li {
  margin: 5px 0;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
}
</style>

