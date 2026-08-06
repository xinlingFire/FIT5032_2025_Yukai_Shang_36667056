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
