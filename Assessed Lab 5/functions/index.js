const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { onRequest } = require('firebase-functions/v2/https')
const cors = require('cors')({ origin: true })

initializeApp()

const db = getFirestore()

exports.countBooks = onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      const booksSnapshot = await db.collection('books').get()
      response.status(200).json({ count: booksSnapshot.size })
    } catch (error) {
      console.error('Error counting books:', error)
      response.status(500).json({ error: 'Unable to count books.' })
    }
  })
})

exports.getBooksForSale = onRequest((request, response) => {
  cors(request, response, async () => {
    if (request.method !== 'GET') {
      response.set('Allow', 'GET')
      response.status(405).json({ error: 'Method not allowed.' })
      return
    }

    try {
      const booksSnapshot = await db.collection('books').get()
      const books = booksSnapshot.docs.map((book) => {
        const data = book.data()
        const isbn = Number(data.isbn) || 0

        return {
          id: book.id,
          name: typeof data.name === 'string' ? data.name : 'Untitled book',
          isbn,
          price: Number((4.99 + (isbn % 10)).toFixed(2)),
          currency: 'AUD'
        }
      })

      response.status(200).json({ books })
    } catch (error) {
      console.error('Error loading books for sale:', error)
      response.status(500).json({ error: 'Unable to load the book catalogue.' })
    }
  })
})
