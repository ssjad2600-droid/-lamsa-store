import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from './Toast'
import StarRating from './StarRating'

export default function FeaturedProductBanner({ product }) {
  const { addToCart } = useCart()
  const showToast = useToast()
  const [added, setAdded] = useState(false)

  if (!product) return null

  function handleAdd(e) {
    e.preventDefault()
    addToCart({ ...product, image: product.imageUrl || product.image || '' })
    showToast('تمت الإضافة إلى السلة ✓')
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* رأس القسم */}
        <div className="text-center mb-10">
          <span className="inline-block text-rose-gold text-xs font-semibold tracking-[0.25em] mb-3 uppercase">
            ✦ اختيار المتجر ✦
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">المنتج المميز</h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-12 h-px bg-rose-gold/40" />
            <div className="w-3 h-px bg-rose-gold" />
            <div className="w-12 h-px bg-rose-gold/40" />
          </div>
        </div>

        {/* البانر */}
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden hover:border-rose-gold/30 transition-colors duration-500">

          {/* خلفية زخرفية */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: 'radial-gradient(ellipse at 70% 50%, #C9956C33 0%, transparent 65%)',
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* الصورة / الفيديو */}
            <div className="relative aspect-[2/1] lg:aspect-auto lg:min-h-[420px] overflow-hidden">
              {product.imageUrl || product.image ? (
                <img
                  src={product.imageUrl || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-white/3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-10 h-10 opacity-20">
                    <circle cx="32" cy="20" r="10" fill="#C9956C" />
                    <ellipse cx="32" cy="46" rx="18" ry="10" fill="#F2D1C9" opacity="0.4" />
                    <rect x="22" y="30" width="20" height="18" rx="4" fill="#C9956C" opacity="0.7" />
                  </svg>
                  <span className="text-rose-gold/25 text-xs font-medium">لمسة</span>
                </div>
              )}

              {/* شارة المنتج المميز */}
              <div className="absolute top-5 right-5 flex items-center gap-2 bg-rose-gold text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-rose-gold/40">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                </svg>
                منتج مميز
              </div>
            </div>

            {/* المعلومات */}
            <div className="p-8 sm:p-12 flex flex-col justify-center gap-4" dir="rtl">

              {/* الفئة */}
              <span className="text-rose-gold/80 text-xs font-semibold tracking-[0.2em] uppercase">
                {product.category}
              </span>

              {/* الاسم */}
              <h3 className="text-3xl sm:text-4xl font-bold text-white leading-snug">
                {product.name}
              </h3>

              {/* التقييم */}
              {product.rating && (
                <div>
                  <StarRating rating={product.rating} size="lg" />
                </div>
              )}

              {/* السعر */}
              <p className="text-3xl font-bold text-rose-gold">
                {Number(product.price).toLocaleString('ar-IQ')} <span className="text-lg font-normal text-rose-gold/70">د.ع</span>
              </p>

              {/* الوصف */}
              {product.desc && (
                <p className="text-white/65 leading-relaxed text-sm sm:text-base line-clamp-3">
                  {product.desc}
                </p>
              )}

              {/* الأزرار */}
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                  onClick={handleAdd}
                  className={`flex items-center justify-center gap-2 font-bold py-3.5 px-8 rounded-full text-sm transition-all duration-300 ${
                    added
                      ? 'bg-green-500/80 text-white'
                      : 'bg-rose-gold hover:bg-rose-gold/90 text-white hover:shadow-xl hover:shadow-rose-gold/30 hover:-translate-y-0.5'
                  }`}
                >
                  {added ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      تمت الإضافة
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                      أضيفي للسلة
                    </>
                  )}
                </button>

                <Link
                  to={`/products/${product.id}`}
                  className="flex items-center justify-center gap-2 border border-white/25 hover:border-rose-gold text-white/80 hover:text-rose-gold font-semibold py-3.5 px-8 rounded-full text-sm transition-all duration-300"
                >
                  عرضي التفاصيل
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 rotate-180">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>

              {/* ضمانات صغيرة */}
              <div className="flex items-center gap-6 pt-4 border-t border-white/10 mt-2">
                {[['🔒', 'دفع آمن'], ['🚚', 'توصيل سريع'], ['↩', 'إرجاع مجاني']].map(([icon, text]) => (
                  <div key={text} className="flex items-center gap-1.5 text-white/45 text-xs">
                    <span>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
