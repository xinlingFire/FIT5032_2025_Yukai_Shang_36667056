const KEY = 'open-shelf-workshop-bookings'

const read = () => {
  try {
    const value = JSON.parse(window.localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

const save = (values) => window.localStorage.setItem(KEY, JSON.stringify(values))

export const getBookings = () => read()

export const getBookingCount = (workshopId) =>
  read().filter((booking) => booking.workshopId === workshopId).length

export const createBooking = ({ workshop, user, seats }) => {
  const capacity = Number(workshop.capacity ?? 20)
  const count = getBookingCount(workshop.id)
  const requestedSeats = Number(seats)

  if (!Number.isInteger(requestedSeats) || requestedSeats < 1 || requestedSeats > 4) {
    throw new Error('Choose between 1 and 4 seats.')
  }
  if (count + requestedSeats > capacity) {
    throw new Error(`Only ${Math.max(0, capacity - count)} seats remain for this workshop.`)
  }

  const booking = {
    id: window.crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    workshopId: workshop.id,
    workshopTitle: workshop.title,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    seats: requestedSeats,
    createdAt: new Date().toISOString()
  }
  save([...read(), booking])
  return booking
}
