const publicFirebaseConfig = {
  apiKey: 'AIzaSyDx7HONm4GmGsZ3Et-WJuShNaxzyWXX0CI',
  authDomain: 'open-shelf-health-a3.firebaseapp.com',
  projectId: 'open-shelf-health-a3',
  storageBucket: 'open-shelf-health-a3.firebasestorage.app',
  appId: '1:816858572099:web:e783d7cf156855e0477bf6'
}

export const firebaseIsConfigured = () => Boolean(firebaseConfiguration().apiKey)

export const firebaseConfiguration = () => ({
  ...publicFirebaseConfig,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || publicFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || publicFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || publicFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || publicFirebaseConfig.storageBucket,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || publicFirebaseConfig.appId
})
