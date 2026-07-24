import { seedBooks } from '../data/seedBooks'

const BOOKS_STORAGE_KEY = 'open-shelf-library-books'

const cloneBooks = (books) => books.map((book) => ({ ...book }))

export const initialiseLibrary = () => {
  const storedBooks = window.localStorage.getItem(BOOKS_STORAGE_KEY)

  if (!storedBooks) {
    const books = cloneBooks(seedBooks)
    window.localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books))
    return books
  }

  try {
    const books = JSON.parse(storedBooks)
    return Array.isArray(books) ? books : cloneBooks(seedBooks)
  } catch {
    return cloneBooks(seedBooks)
  }
}

export const getBookById = (id) =>
  initialiseLibrary().find((book) => book.id === id)
