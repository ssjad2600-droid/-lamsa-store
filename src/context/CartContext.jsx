import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const p = action.product
      const normalized = {
        id:    p.id,
        name:  p.name,
        price: p.price,
        image: p.image || p.imageUrl || '',
      }
      const exists = state.find((i) => i.id === normalized.id)
      if (exists) {
        return state.map((i) =>
          i.id === normalized.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...state, { ...normalized, qty: 1 }]
    }
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id)
    case 'UPDATE_QTY':
      if (action.qty < 1) return state.filter((i) => i.id !== action.id)
      return state.map((i) =>
        i.id === action.id ? { ...i, qty: action.qty } : i
      )
    case 'CLEAR':
      return []
    case 'INIT':
      return action.payload
    default:
      return state
  }
}

const STORAGE_KEY = 'lamsa_cart'

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(
    cartReducer,
    [],
    () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : []
      } catch {
        return []
      }
    }
  )

  // حفظ في localStorage عند كل تغيير
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  const addToCart    = (product) => dispatch({ type: 'ADD', product })
  const removeFromCart = (id)    => dispatch({ type: 'REMOVE', id })
  const updateQuantity = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty })
  const clearCart    = ()        => dispatch({ type: 'CLEAR' })

  return (
    <CartContext.Provider value={{ items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
