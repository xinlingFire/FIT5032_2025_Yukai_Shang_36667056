<script setup>
import { computed, ref } from 'vue'
import { downloadCsv, printReport } from '../services/exportService'

const props = defineProps({ title: String, rows: Array, columns: Array, filename: { type: String, default: 'report' } })
const search = ref('')
const sortKey = ref(props.columns[0]?.key ?? '')
const direction = ref('asc')
const page = ref(1)
const pageSize = 10
const filteredRows = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()
  return props.rows.filter((row) => !query || props.columns.some((column) => String(row[column.key] ?? '').toLocaleLowerCase().includes(query)))
})
const sortedRows = computed(() => [...filteredRows.value].sort((a, b) => String(a[sortKey.value] ?? '').localeCompare(String(b[sortKey.value] ?? ''), undefined, { numeric: true }) * (direction.value === 'asc' ? 1 : -1)))
const pages = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / pageSize)))
const visibleRows = computed(() => sortedRows.value.slice((page.value - 1) * pageSize, page.value * pageSize))
const sort = (key) => { direction.value = sortKey.value === key && direction.value === 'asc' ? 'desc' : 'asc'; sortKey.value = key }
const resetPage = () => { page.value = 1 }
</script>

<template>
  <section class="interactive-table" :aria-label="title">
    <div class="table-tools">
      <label><span class="visually-hidden">Search {{ title }}</span><input v-model="search" class="form-control" type="search" :placeholder="`Search ${title}`" @input="resetPage" /></label>
      <span class="table-count">{{ filteredRows.length }} results</span>
      <button class="btn btn-sm btn-outline-secondary" type="button" @click="downloadCsv(`${filename}.csv`, columns, sortedRows)">CSV</button>
      <button class="btn btn-sm btn-outline-secondary" type="button" @click="printReport(title, columns, sortedRows)">Print / PDF</button>
    </div>
    <div class="table-responsive"><table class="table align-middle mb-0"><thead><tr><th v-for="column in columns" :key="column.key" scope="col"><button class="sort-button" type="button" @click="sort(column.key)">{{ column.label }} <span aria-hidden="true">{{ sortKey === column.key ? (direction === 'asc' ? '↑' : '↓') : '↕' }}</span></button></th></tr></thead><tbody><tr v-for="row in visibleRows" :key="row.id"><td v-for="column in columns" :key="column.key">{{ row[column.key] }}</td></tr><tr v-if="!visibleRows.length"><td :colspan="columns.length">No matching records.</td></tr></tbody></table></div>
    <nav v-if="pages > 1" class="table-pagination" aria-label="Table pagination"><button class="btn btn-sm btn-outline-secondary" type="button" :disabled="page === 1" @click="page--">Previous</button><span>Page {{ page }} of {{ pages }}</span><button class="btn btn-sm btn-outline-secondary" type="button" :disabled="page === pages" @click="page++">Next</button></nav>
  </section>
</template>
