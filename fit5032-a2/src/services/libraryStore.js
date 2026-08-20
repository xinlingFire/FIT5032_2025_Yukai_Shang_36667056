import { seedBooks } from '../data/seedBooks'
import { normaliseResourceType } from '../data/resourceTypes'
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore'
import { db } from './firebase'

const BOOKS_STORAGE_KEY = 'open-shelf-library-books'
const RESOURCE_SCHEMA_VERSION_KEY = 'open-shelf-health-resource-schema-version'
const RESOURCE_SCHEMA_VERSION = '2'
const LEGACY_BOOK_IDS = new Set([
  'the-left-hand-of-darkness',
  'pachinko',
  'braiding-sweetgrass',
  'klara-and-the-sun',
  'atomic-habits',
  'the-song-of-achilles',
  'thinking-fast-and-slow',
  'the-midnight-library'
])
const SEED_RESOURCE_IDS = new Set(seedBooks.map((book) => book.id))
let cloudHydrationStarted = false

const cloneBooks = (books) => books.map((book) => ({ ...book }))

const saveBooks = (books) => {
  window.localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books))
  return cloneBooks(books)
}

const notifyLibraryChanged = () => window.dispatchEvent(new CustomEvent('library:updated'))

const persistResource = async (resource) => {
  if (!db) return
  await setDoc(doc(db, 'resources', resource.id), { ...resource, updatedAt: new Date().toISOString() })
}

const hydrateFromFirestore = async () => {
  if (!db || cloudHydrationStarted) return
  cloudHydrationStarted = true
  try {
    const snapshot = await getDocs(collection(db, 'resources'))
    if (!snapshot.size) {
      await Promise.all(seedBooks.map((resource) => persistResource(resource)))
      return
    }
    const cloudBooks = snapshot.docs.map((resource) => normaliseStoredResource({ id: resource.id, ...resource.data() }))
    saveBooks(cloudBooks)
    notifyLibraryChanged()
  } catch {
    // Local cache remains available when Firestore rules or network are unavailable.
  }
}

const saveSchemaVersion = () => {
  window.localStorage.setItem(RESOURCE_SCHEMA_VERSION_KEY, RESOURCE_SCHEMA_VERSION)
}

const createSeedResources = () => {
  const resources = cloneBooks(seedBooks)
  saveSchemaVersion()
  return saveBooks(resources)
}

const normaliseStoredResource = (resource) => ({
  ...resource,
  type: normaliseResourceType(resource.type),
  eventDate: resource.type === 'workshop' ? resource.eventDate ?? '' : undefined,
  eventTime: resource.type === 'workshop' ? resource.eventTime ?? '' : undefined,
  venue: resource.type === 'workshop' ? resource.venue ?? '' : undefined
})

const upgradeHealthResources = (books) => {
  const customResources = books
    // Refresh supplied resources but retain coordinator-created resources.
    .filter((book) => !SEED_RESOURCE_IDS.has(book.id) && !LEGACY_BOOK_IDS.has(book.id))
    .map(normaliseStoredResource)
  const upgradedResources = [...cloneBooks(seedBooks), ...customResources]

  saveSchemaVersion()
  return saveBooks(upgradedResources)
}

const createBookId = (title, books) => {
  const baseId = title
    .toLocaleLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48) || 'library-book'

  let id = baseId
  let suffix = 2

  while (books.some((book) => book.id === id)) {
    id = `${baseId}-${suffix}`
    suffix += 1
  }

  return id
}

const isLegacyBookCatalogue = (books) =>
  books.some((book) => LEGACY_BOOK_IDS.has(book.id))

export const initialiseLibrary = () => {
  void hydrateFromFirestore()
  const storedBooks = window.localStorage.getItem(BOOKS_STORAGE_KEY)

  if (!storedBooks) {
    return createSeedResources()
  }

  try {
    const books = JSON.parse(storedBooks)

    if (!Array.isArray(books)) {
      return createSeedResources()
    }

    if (isLegacyBookCatalogue(books)) {
      return upgradeHealthResources(books)
    }

    if (window.localStorage.getItem(RESOURCE_SCHEMA_VERSION_KEY) !== RESOURCE_SCHEMA_VERSION) {
      return upgradeHealthResources(books)
    }

    return books
  } catch {
    return createSeedResources()
  }
}

export const getBookById = (id) =>
  initialiseLibrary().find((book) => book.id === id)

export const createBook = (bookDetails) => {
  const books = initialiseLibrary()
  const book = {
    ...bookDetails,
    id: createBookId(bookDetails.title, books)
  }

  const updatedBooks = saveBooks([...books, book])
  void persistResource(book)
  notifyLibraryChanged()
  return updatedBooks
}

export const updateBook = (id, bookDetails) => {
  const books = initialiseLibrary()
  const updatedBooks = books.map((book) =>
    book.id === id ? { ...book, ...bookDetails, id } : book
  )

  const updatedBook = updatedBooks.find((book) => book.id === id)
  if (updatedBook) void persistResource(updatedBook)
  notifyLibraryChanged()
  return saveBooks(updatedBooks)
}

export const removeBook = (id) => {
  const books = initialiseLibrary()
  const updatedBooks = saveBooks(books.filter((book) => book.id !== id))
  if (db) void deleteDoc(doc(db, 'resources', id))
  notifyLibraryChanged()
  return updatedBooks
}
