<script setup>
defineProps({
  categories: {
    type: Array,
    required: true
  },
  resourceTypes: {
    type: Array,
    required: true
  },
  resultCount: {
    type: Number,
    required: true
  },
  searchTerm: {
    type: String,
    required: true
  },
  selectedCategory: {
    type: String,
    required: true
  },
  selectedType: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:searchTerm', 'update:selectedCategory', 'update:selectedType', 'reset'])
</script>

<template>
  <section class="filter-panel" aria-label="Health resource filters">
    <div class="row g-3 align-items-end">
      <div class="col-12 col-md-5">
        <label class="form-label" for="catalogue-search">Search health resources</label>
        <input
          id="catalogue-search"
          class="form-control form-control-lg"
          type="search"
          :value="searchTerm"
          placeholder="Search by resource or provider"
          @input="emit('update:searchTerm', $event.target.value)"
        />
      </div>
      <div class="col-6 col-md-3">
        <label class="form-label" for="category-filter">Health topic</label>
        <select
          id="category-filter"
          class="form-select form-select-lg"
          :value="selectedCategory"
          @change="emit('update:selectedCategory', $event.target.value)"
        >
          <option value="">All health topics</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      <div class="col-6 col-md-2">
        <label class="form-label" for="type-filter">Resource type</label>
        <select
          id="type-filter"
          class="form-select form-select-lg"
          :value="selectedType"
          @change="emit('update:selectedType', $event.target.value)"
        >
          <option value="">All types</option>
          <option v-for="resourceType in resourceTypes" :key="resourceType.value" :value="resourceType.value">
            {{ resourceType.label }}
          </option>
        </select>
      </div>
      <div class="col-12 col-md-2">
        <button class="btn btn-outline-secondary btn-lg w-100" type="button" @click="emit('reset')">
          Clear
        </button>
      </div>
    </div>
    <p class="result-count mb-0 mt-3" aria-live="polite">
      {{ resultCount }} {{ resultCount === 1 ? 'resource' : 'resources' }} found
    </p>
  </section>
</template>
