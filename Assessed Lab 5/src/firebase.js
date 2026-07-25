import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { ref } from 'vue'

const firebaseConfig = {
  apiKey: 'AIzaSyD807h__f8jihuxg3tJVZtQF3bgxPoXOxc',
  authDomain: 'week7-yukai.firebaseapp.com',
  projectId: 'week7-yukai',
  storageBucket: 'week7-yukai.firebasestorage.app',
  messagingSenderId: '423770825040',
  appId: '1:423770825040:web:e39ebe061ea0a45f468c55'
}

const app = initializeApp(firebaseConfig)

export const firebaseAuth = getAuth(app)
export const firebaseCurrentUser = ref(firebaseAuth.currentUser)

onAuthStateChanged(firebaseAuth, (user) => {
  firebaseCurrentUser.value = user
})
