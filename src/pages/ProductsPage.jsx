import { useState, useMemo, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { products as staticProducts, categories } from '../data/products'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'

export default function ProductsPage() {
  const [products, setProducts] = useState(staticProducts)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')

  useEffect(() => {
    async function fetchProducts() {
      if (!db) { setLoading(false); return }
      try {
        const snapshot = await getDocs(collection(db, 'products'))
        if (!snapshot.empty) {
          const firestoreProducts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          const deletedIds = new Set(
            firestoreProducts.filter((p) => p.deleted).map((p) => String(p.id))
          )
          const activeFirestore = firestoreProducts.filter((p) => !p.deleted)
          const overrideMap = Object.fromEntries(
            activeFirestore
              .filter((p) => staticProducts.some((s) => String(s.id) === String(p.id)))
              .map((p) => [String(p.id), p])
          )
          const newFromFirestore = activeFirestore.filter(
            (p) => !staticProducts.some((s) => String(s.id) === String(p.id))
          )
          const merged = [
            ...staticProducts
              .filter((s) => !deletedIds.has(String(s.id)))
              .map((s) => overrideMap[String(s.id)] ? { ...s, ...overrideMap[String(s.id)] } : s),
            ...newFromFirestore,
          ]
          setProducts(merged)
        }
      } catch {
        // Firebase غير متاح — نستخدم البيانات الثابتة
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filtered = useMemo(() => {
    let list = activeCategory === 'الكل'
      ? products
      : products.filter((p) => p.category === activeCategory)

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }

    if (sort === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating')     list = [...list].sort((a, b) => b.rating - a.rating)

    return list
  }, [products, activeCategory, search, sort])

  return (
    <div className="min-h-screen font-arabic" dir="rtl">
      <Navbar />

      {/* ══ رأس الصفحة ══ */}
      <div className="pt-32 pb-10 px-4 text-center">
        <span className="inline-block text-rose-gold text-xs font-semibold tracking-[0.25em] mb-3 uppercase">
          ✦ تشكيلتنا الكاملة ✦
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white">منتجاتنا</h1>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="w-12 h-px bg-rose-gold/40" />
          <div className="w-3 h-px bg-rose-gold" />
          <div className="w-12 h-px bg-rose-gold/40" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* ══ شريط البحث والترتيب ══ */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* بحث */}
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40 pointer-events-none w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحثي عن منتج..."
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 focus:border-rose-gold rounded-full pr-11 pl-5 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors duration-200"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* ترتيب */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white/10 backdrop-blur-md border border-white/20 focus:border-rose-gold text-white rounded-full px-5 py-3 text-sm outline-none transition-colors duration-200 cursor-pointer"
          >
            <option value="default"    className="bg-deep-plum">الترتيب الافتراضي</option>
            <option value="price-asc"  className="bg-deep-plum">السعر: من الأقل</option>
            <option value="price-desc" className="bg-deep-plum">السعر: من الأعلى</option>
            <option value="rating"     className="bg-deep-plum">الأعلى تقييماً</option>
          </select>
        </div>

        {/* ══ تبويبات الفلتر ══ */}
        <div className="flex items-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeCategory === cat
                  ? 'bg-rose-gold border-rose-gold text-white shadow-lg shadow-rose-gold/25'
                  : 'bg-white/8 border-white/20 text-white/75 hover:border-rose-gold/50 hover:text-white backdrop-blur-sm'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-white/40 text-xs mr-2">{filtered.length} منتج</span>
        </div>

        {/* ══ شبكة المنتجات ══ */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <svg className="animate-spin w-10 h-10 text-rose-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-white/50 text-sm">جارٍ تحميل المنتجات...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                rating={p.rating}
                badge={p.rating >= 4.8 ? '⭐ الأفضل' : undefined}
                image={p.imageUrl}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-white/60 text-lg">لا توجد منتجات تطابق بحثكِ</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('الكل') }}
              className="mt-6 px-6 py-2.5 border border-rose-gold/50 text-rose-gold rounded-full text-sm hover:bg-rose-gold hover:text-white transition-all duration-200"
            >
              مسح الفلتر
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
