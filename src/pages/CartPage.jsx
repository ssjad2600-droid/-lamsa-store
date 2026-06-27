import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

const DELIVERY = 5000

function QtyControl({ id, qty, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5">
      <button
        onClick={() => onChange(id, qty - 1)}
        className="text-white/70 hover:text-rose-gold w-5 h-5 flex items-center justify-center transition-colors font-bold"
      >−</button>
      <span className="text-white font-bold text-sm w-5 text-center">{qty}</span>
      <button
        onClick={() => onChange(id, qty + 1)}
        className="text-white/70 hover:text-rose-gold w-5 h-5 flex items-center justify-center transition-colors font-bold"
      >+</button>
    </div>
  )
}

export default function CartPage() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart()
  const total = totalPrice + (items.length > 0 ? DELIVERY : 0)

  /* ── سلة فارغة ── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen font-arabic" dir="rtl">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 gap-6">
          <div className="w-28 h-28 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-5xl">
            🛒
          </div>
          <h2 className="text-2xl font-bold text-white">سلتك فارغة!</h2>
          <p className="text-white/55 text-sm max-w-xs">لم تضيفي أي منتج بعد. استكشفي تشكيلتنا الرائعة.</p>
          <Link
            to="/products"
            className="mt-2 px-8 py-3 bg-rose-gold hover:bg-rose-gold/90 text-white font-bold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-rose-gold/30"
          >
            تسوقي الآن
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-arabic" dir="rtl">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* رأس الصفحة */}
        <div className="mb-10">
          <span className="inline-block text-rose-gold text-xs font-semibold tracking-[0.25em] mb-2 uppercase">✦ سلة التسوق ✦</span>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">سلتكِ ({totalItems})</h1>
            <button
              onClick={clearCart}
              className="text-xs text-white/40 hover:text-red-400 transition-colors duration-200 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              إفراغ السلة
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ══ قائمة المنتجات ══ */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/13 transition-colors duration-200"
              >
                {/* صورة placeholder */}
                <div className="w-20 h-20 rounded-xl bg-white/10 border border-white/15 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="w-10 h-10 opacity-40">
                      <circle cx="20" cy="13" r="6" fill="#C9956C" />
                      <rect x="14" y="19" width="12" height="11" rx="2" fill="#C9956C" opacity="0.7" />
                    </svg>
                  )}
                </div>

                {/* المعلومات */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 mb-1">{item.name}</h3>
                  <p className="text-rose-gold font-bold text-base">{(item.price ?? 0).toLocaleString('ar-IQ')} د.ع</p>
                </div>

                {/* الكمية + حذف */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-white/30 hover:text-red-400 transition-colors duration-200 p-1"
                    aria-label="حذف"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <QtyControl id={item.id} qty={item.qty} onChange={updateQuantity} />
                  <span className="text-white/40 text-xs">
                    المجموع: {((item.price ?? 0) * item.qty).toLocaleString('ar-IQ')} د.ع
                  </span>
                </div>
              </div>
            ))}

            <Link
              to="/products"
              className="flex items-center gap-2 text-rose-gold hover:text-rose-gold/80 text-sm font-medium mt-2 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              إضافة منتجات أخرى
            </Link>
          </div>

          {/* ══ ملخص الطلب ══ */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sticky top-24">
              <h2 className="text-white font-bold text-lg mb-6">ملخص الطلب</h2>

              <div className="flex flex-col gap-3 text-sm mb-6">
                <div className="flex items-center justify-between text-white/70">
                  <span>المجموع الفرعي ({totalItems} منتج)</span>
                  <span>{totalPrice.toLocaleString('ar-IQ')} د.ع</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span>التوصيل</span>
                  <span>{DELIVERY.toLocaleString('ar-IQ')} د.ع</span>
                </div>
                <div className="h-px bg-white/15 my-1" />
                <div className="flex items-center justify-between text-white font-bold text-base">
                  <span>المجموع الكلي</span>
                  <span className="text-rose-gold text-lg">{total.toLocaleString('ar-IQ')} د.ع</span>
                </div>
              </div>

              {/* كوبون */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="كود الخصم"
                  className="flex-1 bg-white/10 border border-white/20 focus:border-rose-gold text-white placeholder:text-white/30 rounded-full px-4 py-2.5 text-xs outline-none transition-colors duration-200"
                />
                <button className="px-4 py-2.5 border border-rose-gold/50 text-rose-gold rounded-full text-xs font-semibold hover:bg-rose-gold hover:text-white transition-all duration-200 whitespace-nowrap">
                  تطبيق
                </button>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-rose-gold hover:bg-rose-gold/90 text-white font-bold py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-rose-gold/30 hover:-translate-y-0.5 active:translate-y-0 text-base text-center"
              >
                إتمام الطلب ←
              </Link>

              {/* ضمانات */}
              <div className="flex items-center justify-center gap-4 mt-5">
                {[['🔒', 'دفع آمن'], ['↩', 'إرجاع مجاني']].map(([icon, text]) => (
                  <div key={text} className="flex items-center gap-1.5 text-white/35 text-xs">
                    <span>{icon}</span><span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
