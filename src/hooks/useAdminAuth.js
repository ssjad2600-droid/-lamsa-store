import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, firebaseReady } from '../config/firebase'

export function useAdminAuth() {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    if (!firebaseReady || !auth) {
      setUser(null)
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return unsub
  }, [])

  return user
}
