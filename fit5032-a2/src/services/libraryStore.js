import { seedBooks } from '../data/seedBooks'

const BOOKS_STORAGE_KEY = 'open-shelf-library-books'
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

const cloneBooks = (books) => books.map((book) => ({ ...book }))

const saveBooks = (books) => {
  window.localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books))
  return cloneBooks(books)
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
  const storedBooks = window.localStorage.getItem(BOOKS_STORAGE_KEY)

  if (!storedBooks) {
    const books = cloneBooks(seedBooks)
    window.localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books))
    return books
  }

  try {
    const books = JSON.parse(storedBooks)

    if (!Array.isArray(books)) {
      return cloneBooks(seedBooks)
    }

    return isLegacyBookCatalogue(books) ? saveBooks(cloneBooks(seedBooks)) : books
  } catch {
    return cloneBooks(seedBooks)
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

  return saveBooks([...books, book])
}

export const updateBook = (id, bookDetails) => {
  const books = initialiseLibrary()
  const updatedBooks = books.map((book) =>
    book.id === id ? { ...book, ...bookDetails, id } : book
  )

  return saveBooks(updatedBooks)
}

export const removeBook = (id) => {
  const books = initialiseLibrary()
  return saveBooks(books.filter((book) => book.id !== id))
}
