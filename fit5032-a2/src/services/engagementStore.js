const FAVOURITES_STORAGE_KEY = 'open-shelf-library-favourites'
const RATINGS_STORAGE_KEY = 'open-shelf-library-ratings'

const readList = (key) => {
  try {
    const storedValue = JSON.parse(window.localStorage.getItem(key) ?? '[]')
    return Array.isArray(storedValue) ? storedValue : []
  } catch {
    return []
  }
}

const saveList = (key, values) => {
  window.localStorage.setItem(key, JSON.stringify(values))
  return values
}

const createId = () =>
  window.crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`

export const getFavouriteBookIds = (userId) =>
  readList(FAVOURITES_STORAGE_KEY)
    .filter((favourite) => favourite.userId === userId)
    .map((favourite) => favourite.bookId)

export const isBookFavourite = (userId, bookId) =>
  getFavouriteBookIds(userId).includes(bookId)

export const toggleFavourite = (userId, bookId) => {
  const favourites = readList(FAVOURITES_STORAGE_KEY)
  const existingFavourite = favourites.find(
    (favourite) => favourite.userId === userId && favourite.bookId === bookId
  )

  if (existingFavourite) {
    saveList(
      FAVOURITES_STORAGE_KEY,
      favourites.filter((favourite) => favourite !== existingFavourite)
    )
    return false
  }

  saveList(FAVOURITES_STORAGE_KEY, [
    ...favourites,
    {
      id: createId(),
      userId,
      bookId,
      createdAt: new Date().toISOString()
    }
  ])
  return true
}

export const getBookReviews = (bookId) =>
  readList(RATINGS_STORAGE_KEY)
    .filter((rating) => rating.bookId === bookId)
    .sort((firstRating, secondRating) =>
      secondRating.updatedAt.localeCompare(firstRating.updatedAt)
    )

export const getUserBookRating = (userId, bookId) =>
  getBookReviews(bookId).find((rating) => rating.userId === userId) ?? null

export const getRatingSummary = (bookId) => {
  const ratings = getBookReviews(bookId)

  if (!ratings.length) {
    return { count: 0, average: null }
  }

  const total = ratings.reduce((sum, rating) => sum + rating.score, 0)
  return { count: ratings.length, average: Number((total / ratings.length).toFixed(1)) }
}

export const getRatingSummaries = () => {
  const summaries = {}

  readList(RATINGS_STORAGE_KEY).forEach((rating) => {
    const summary = summaries[rating.bookId] ?? { count: 0, total: 0 }
    summaries[rating.bookId] = { count: summary.count + 1, total: summary.total + rating.score }
  })

  return Object.fromEntries(
    Object.entries(summaries).map(([bookId, summary]) => [
      bookId,
      { count: summary.count, average: Number((summary.total / summary.count).toFixed(1)) }
    ])
  )
}

export const saveBookRating = ({ bookId, userId, score, comment }) => {
  const ratings = readList(RATINGS_STORAGE_KEY)
  const existingIndex = ratings.findIndex(
    (rating) => rating.bookId === bookId && rating.userId === userId
  )
  const timestamp = new Date().toISOString()
  const rating = {
    id: existingIndex >= 0 ? ratings[existingIndex].id : createId(),
    bookId,
    userId,
    score,
    comment: comment.trim(),
    createdAt: existingIndex >= 0 ? ratings[existingIndex].createdAt : timestamp,
    updatedAt: timestamp
  }
  const updatedRatings =
    existingIndex >= 0
      ? ratings.map((storedRating, index) => (index === existingIndex ? rating : storedRating))
      : [...ratings, rating]

  saveList(RATINGS_STORAGE_KEY, updatedRatings)
  return rating
}

export const clearBookEngagement = (bookId) => {
  saveList(
    FAVOURITES_STORAGE_KEY,
    readList(FAVOURITES_STORAGE_KEY).filter((favourite) => favourite.bookId !== bookId)
  )
  saveList(
    RATINGS_STORAGE_KEY,
    readList(RATINGS_STORAGE_KEY).filter((rating) => rating.bookId !== bookId)
  )
}
