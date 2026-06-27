import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { products as staticProducts } from '../data/products'

export function useProducts() {
  const [products, setProducts] = useState(staticProducts)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!db) { setLoading(false); return }
    getDocs(collection(db, 'products'))
      .then((snap) => {
        if (!snap.empty) {
          const firestoreList = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          const deletedIds = new Set(
            firestoreList.filter((p) => p.deleted).map((p) => String(p.id))
          )
          const active = firestoreList.filter((p) => !p.deleted)
          const overrideMap = Object.fromEntries(
            active
              .filter((p) => staticProducts.some((s) => String(s.id) === String(p.id)))
              .map((p) => [String(p.id), p])
          )
          const newOnes = active.filter(
            (p) => !staticProducts.some((s) => String(s.id) === String(p.id))
          )
          setProducts([
            ...staticProducts
              .filter((s) => !deletedIds.has(String(s.id)))
              .map((s) => overrideMap[String(s.id)] ? { ...s, ...overrideMap[String(s.id)] } : s),
            ...newOnes,
          ])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { products, loading }
}
