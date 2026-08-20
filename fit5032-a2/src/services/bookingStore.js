const KEY = 'open-shelf-workshop-bookings'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebase'
let cloudHydrationStarted = false

const read = () => {
  try {
    const value = JSON.parse(window.localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

const save = (values) => window.localStorage.setItem(KEY, JSON.stringify(values))

const notify = () => window.dispatchEvent(new CustomEvent('bookings:updated'))
const hydrate = async () => {
  if (!db || cloudHydrationStarted) return
  cloudHydrationStarted = true
  try {
    const snapshot = await getDocs(collection(db, 'bookings'))
    const bookings = snapshot.docs.map((booking) => ({ id: booking.id, ...booking.data() }))
    save(bookings)
    notify()
  } catch {
    // Keep the local cache when the cloud collection is not available yet.
  }
}

export const getBookings = () => { void hydrate(); return read() }

export const getBookingCount = (workshopId) =>
  read()
    .filter((booking) => booking.workshopId === workshopId)
    .reduce((total, booking) => total + Math.max(1, Number(booking.seats) || 1), 0)

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
  if (db) void addDoc(collection(db, 'bookings'), booking).catch(() => {})
  notify()
  return booking
}
