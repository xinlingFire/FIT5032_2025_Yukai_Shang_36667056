import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyD807h__f8jihuxg3tJVZtQF3bgxPoXOxc',
  authDomain: 'week7-yukai.firebaseapp.com',
  projectId: 'week7-yukai',
  storageBucket: 'week7-yukai.firebasestorage.app',
  messagingSenderId: '423770825040',
  appId: '1:423770825040:web:e39ebe061ea0a45f468c55'
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
