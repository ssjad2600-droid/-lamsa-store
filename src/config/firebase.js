import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
}

// لا تهيّئ إذا كانت البيانات فارغة (مرحلة التطوير قبل إعداد Firebase)
const isConfigured = firebaseConfig.apiKey && firebaseConfig.projectId

const app = isConfigured
  ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig))
  : null

export const db       = app ? getFirestore(app) : null
export const storage  = app ? getStorage(app)   : null
export const auth     = app ? getAuth(app)       : null
export const firebaseReady = !!app
