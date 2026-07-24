export const RESOURCE_TYPES = [
  { value: 'book', label: 'Health book', contributorLabel: 'Author', yearLabel: 'Published' },
  { value: 'guide', label: 'Practical guide', contributorLabel: 'Provider', yearLabel: 'Last updated' },
  { value: 'workshop', label: 'Community workshop', contributorLabel: 'Hosted by', yearLabel: 'Session year' }
]

const FALLBACK_TYPE = RESOURCE_TYPES[1]

export const getResourceType = (type) =>
  RESOURCE_TYPES.find((resourceType) => resourceType.value === type) ?? FALLBACK_TYPE

export const normaliseResourceType = (type) => getResourceType(type).value

export const formatWorkshopSchedule = (resource, includeYear = true) => {
  if (!resource.eventDate) {
    return 'Schedule to be confirmed'
  }

  const date = new Date(`${resource.eventDate}T00:00:00`)
  const dateOptions = includeYear
    ? { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }
    : { weekday: 'short', day: 'numeric', month: 'short' }
  const formattedDate = date.toLocaleDateString('en-AU', dateOptions)

  return resource.eventTime ? `${formattedDate}, ${resource.eventTime}` : formattedDate
}
