<script setup>
import { computed } from 'vue'
import { BookOpen, FileText, Presentation } from '@lucide/vue'
import { formatWorkshopSchedule, getResourceType, normaliseResourceType } from '../data/resourceTypes'

const props = defineProps({
  resource: {
    type: Object,
    required: true
  },
  detail: {
    type: Boolean,
    default: false
  }
})

const resourceType = computed(() => getResourceType(normaliseResourceType(props.resource.type)))
const icon = computed(() => {
  const icons = {
    book: BookOpen,
    guide: FileText,
    workshop: Presentation
  }

  return icons[resourceType.value.value]
})
const coverMeta = computed(() =>
  resourceType.value === 'workshop'
    ? formatWorkshopSchedule(props.resource, !props.detail)
    : props.resource.year
)
</script>

<template>
  <div
    :class="['resource-cover', { 'resource-cover-detail': detail }]"
    :style="{ '--cover-colour': resource.accent }"
  >
    <p class="resource-cover-type">{{ resourceType.label }}</p>
    <component :is="icon" class="resource-cover-icon" :size="detail ? 104 : 64" :stroke-width="1.5" aria-hidden="true" />
    <small>{{ coverMeta }}</small>
  </div>
</template>
