import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import { getStorage } from 'firebase/storage'
import { firebaseConfiguration, firebaseIsConfigured } from './firebaseReadiness'

export const firebaseEnabled = firebaseIsConfigured()

const app = firebaseEnabled
  ? (getApps().length ? getApp() : initializeApp(firebaseConfiguration()))
  : null

export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
export const storage = app ? getStorage(app) : null
export const functions = app ? getFunctions(app) : null
