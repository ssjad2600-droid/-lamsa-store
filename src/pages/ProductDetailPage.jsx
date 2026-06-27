import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import StarRating from '../components/StarRating'
import Footer from '../components/Footer'
import { products as staticData } from '../data/products'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { products: allProducts } = useProducts()
  const staticProduct = staticData.find((p) => p.id === Number(id))
  const [product, setProduct] = useState(staticProduct || null)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [added, setAdded] = useState(false)
  const [qty, setQty] = useState(1)
  const { addToCart } = useCart()
  const showToast = useToast()

  // تحقق من Firestore دائماً: قد يكون المنتج معدّلاً أو محذوفاً من الأدمن
  useEffect(() => {
    if (!db) { setLoadingProduct(false); return }
    getDoc(doc(db, 'products', id))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data()
          if (data.deleted) {
            setProduct(null)
          } else {
            setProduct({ ...staticProduct, id: snap.id, ...data })
          }
        }
        // إذا لم يوجد في Firestore، يبقى staticProduct كما هو
      })
      .catch(() => {})
      .finally(() => setLoadingProduct(false))
  }, [id])

  if (loadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center font-arabic">
        <svg className="animate-spin w-10 h-10 text-rose-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-arabic" dir="rtl">
        <p className="text-white/60 text-xl mb-6">المنتج غير موجود</p>
        <Link to="/products" className="text-rose-gold hover:underline text-sm">← العودة للمنتجات</Link>
      </div>
    )
  }

  const similar = allProducts.filter((p) => p.category === product.category && String(p.id) !== String(id)).slice(0, 4)

  function handleAdd() {
    for (let i = 0; i < qty; i++) addToCart(product)
    showToast('تمت الإضافة إلى السلة ✓')
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen font-arabic" dir="rtl">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-white/45 text-xs mb-10">
          <Link to="/" className="hover:text-rose-gold transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-rose-gold transition-colors">المنتجات</Link>
          <span>/</span>
          <span className="text-white/70">{product.name}</span>
        </nav>

        {/* ══ المنتج الرئيسي ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">

          {/* الصورة */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden aspect-square">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-12">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-28 h-28 mx-auto mb-4 opacity-60">
                  <circle cx="32" cy="20" r="10" fill="#C9956C" />
                  <ellipse cx="32" cy="46" rx="18" ry="10" fill="#F2D1C9" opacity="0.4" />
                  <rect x="22" y="30" width="20" height="18" rx="4" fill="#C9956C" opacity="0.7" />
                </svg>
                <span className="text-rose-gold/60 text-sm font-medium">لمسة</span>
              </div>
            )}
          </div>

          {/* التفاصيل */}
          <div className="flex flex-col justify-center">
            {/* الفئة */}
            <span className="inline-block text-rose-gold text-xs font-semibold tracking-widest mb-4 uppercase">
              {product.category}
            </span>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-snug">
              {product.name}
            </h1>

            <div className="mb-5">
              <StarRating rating={product.rating} size="lg" />
            </div>

            <p className="text-3xl font-bold text-rose-gold mb-6">
              {Number(product.price || 0).toLocaleString('ar-IQ')} د.ع
            </p>

            <p className="text-white/70 leading-relaxed mb-8 text-base">
              {product.desc}
            </p>

            {/* الكمية */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-white/60 text-sm">الكمية:</span>
              <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-full px-4 py-2">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-white/70 hover:text-rose-gold w-5 h-5 flex items-center justify-center transition-colors">−</button>
                <span className="text-white font-bold w-6 text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="text-white/70 hover:text-rose-gold w-5 h-5 flex items-center justify-center transition-colors">+</button>
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-4 rounded-full text-base transition-all duration-300 ${
                  added
                    ? 'bg-green-500/80 text-white'
                    : 'bg-rose-gold hover:bg-rose-gold/90 text-white hover:shadow-xl hover:shadow-rose-gold/30 hover:-translate-y-0.5'
                }`}
              >
                {added ? (
                  <><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg> تمت الإضافة للسلة</>
                ) : (
                  <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg> أضيفي للسلة</>
                )}
              </button>
              <button className="flex-1 border border-white/25 hover:border-rose-gold text-white/80 hover:text-rose-gold font-semibold py-4 rounded-full text-base transition-all duration-300 backdrop-blur-sm">
                ❤ أضيفي للمفضلة
              </button>
            </div>

            {/* ضمانات */}
            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-white/10">
              {[['🔒', 'دفع آمن'], ['🚚', 'توصيل سريع'], ['↩', 'إرجاع مجاني']].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-2 text-white/50 text-xs">
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ منتجات مشابهة ══ */}
        {similar.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <span className="inline-block text-rose-gold text-xs font-semibold tracking-[0.25em] mb-3 uppercase">✦ قد يعجبكِ أيضاً ✦</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">منتجات مشابهة</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {similar.map((p) => (
                <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} rating={p.rating} image={p.imageUrl} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
