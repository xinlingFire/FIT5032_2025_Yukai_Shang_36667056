import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { ref } from 'vue'
import { app } from './firebase/init'

export const firebaseAuth = getAuth(app)
export const firebaseCurrentUser = ref(firebaseAuth.currentUser)

onAuthStateChanged(firebaseAuth, (user) => {
  firebaseCurrentUser.value = user
})
