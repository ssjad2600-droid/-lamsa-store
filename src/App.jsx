import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './components/Toast'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AboutPage from './pages/AboutPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProductsManager from './pages/admin/ProductsManager'
import ProtectedRoute from './components/admin/ProtectedRoute'

function VideoBackground() {
  const location = useLocation()
  if (location.pathname.startsWith('/admin')) return null
  return (
    <>
      <video
        autoPlay muted loop playsInline
        x-webkit-airplay="allow"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', zIndex: -1,
        }}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          background: 'linear-gradient(to bottom, rgba(74,25,66,0.65) 0%, rgba(0,0,0,0.45) 100%)',
          zIndex: 0, pointerEvents: 'none',
        }}
      />
    </>
  )
}

function AppInner() {
  return (
    <CartProvider>
      <ToastProvider>
        <VideoBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route path="/"             element={<HomePage />} />
            <Route path="/products"     element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart"         element={<CartPage />} />
            <Route path="/checkout"     element={<CheckoutPage />} />
            <Route path="/about"        element={<AboutPage />} />

            {/* ══ مسارات الأدمن ══ */}
            <Route path="/admin/login"      element={<AdminLogin />} />
            <Route path="/admin/dashboard"  element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/products"   element={<ProtectedRoute><ProductsManager /></ProtectedRoute>} />
          </Routes>
        </div>
      </ToastProvider>
    </CartProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
