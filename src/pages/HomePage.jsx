import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import FeaturedProductBanner from '../components/FeaturedProductBanner'
import Footer from '../components/Footer'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'

function MobileProductCard({ id, name, price, badge, image }) {
  const { addToCart } = useCart()
  const showToast = useToast()
  return (
    <Link
      to={id ? `/products/${id}` : '#'}
      className="flex-shrink-0 w-36 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden block"
    >
      <div className="relative w-36 h-36 overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-7 h-7 opacity-20">
              <circle cx="32" cy="20" r="10" fill="#C9956C" />
              <ellipse cx="32" cy="46" rx="18" ry="10" fill="#F2D1C9" opacity="0.4" />
              <rect x="22" y="30" width="20" height="18" rx="4" fill="#C9956C" opacity="0.7" />
            </svg>
          </div>
        )}
        {badge && (
          <span className="absolute top-2 right-2 bg-rose-gold text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-white text-xs font-semibold line-clamp-2 leading-snug mb-1.5">{name}</p>
        <div className="flex items-center justify-between gap-1">
          <span className="text-rose-gold font-bold text-[11px]">{(price ?? 0).toLocaleString('ar-IQ')}</span>
          <button
            onClick={(e) => { e.preventDefault(); addToCart({ id, name, price, image }); showToast('تمت الإضافة ✓') }}
            className="bg-rose-gold text-white text-[10px] font-bold px-2 py-1 rounded-full"
          >
            + سلة
          </button>
        </div>
      </div>
    </Link>
  )
}

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    title: 'منتجات أصلية 100%',
    desc:  'جميع منتجاتنا مُستوردة من مصادر معتمدة ومضمونة الأصالة',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    title: 'توصيل سريع',
    desc:  'نوصّل طلبكِ خلال 24–48 ساعة إلى جميع محافظات العراق',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: 'ضمان الجودة',
    desc:  'نضمن رضاكِ التام أو نُعيد المبلغ كاملاً خلال 7 أيام',
  },
]

export default function HomePage() {
  const { products } = useProducts()
  const featuredProduct = products.find((p) => p.featured === true) || null
  const featuredProducts = products.slice(0, 6)

  return (
    <div className="min-h-screen font-arabic" dir="rtl">
      <Navbar />

      {/* ══════════════ Hero ══════════════ */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-4">
        {/* شارة صغيرة */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-gold animate-pulse" />
          <span className="text-white/80 text-xs tracking-widest">تشكيلة صيف ٢٠٢٥</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-bold text-white leading-[1.12] mb-5 drop-shadow-xl">
          اكتشفي جمالك
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #C9956C 0%, #F2D1C9 60%, #C9956C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            الحقيقي
          </span>
        </h1>

        <p className="text-white/70 text-base sm:text-lg mb-10 max-w-lg leading-relaxed">
          تشكيلة مختارة من أفضل منتجات التجميل العالمية
          <br className="hidden sm:block" />
          لتُعبّري عن أناقتكِ بثقة وأصالة
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-3.5 bg-rose-gold hover:bg-rose-gold/90 text-white font-bold rounded-full text-base transition-all duration-300 shadow-lg hover:shadow-rose-gold/40 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
          >
            تسوقي الآن
          </button>
          <a
            href="#about"
            className="px-8 py-3.5 border border-white/30 hover:border-rose-gold text-white/80 hover:text-rose-gold font-medium rounded-full text-base transition-all duration-300 backdrop-blur-sm"
          >
            اعرفي المزيد
          </a>
        </div>

        {/* إحصائيات سريعة */}
        <div className="absolute bottom-16 flex items-center gap-8 text-center">
          {[['٥٠٠٠+', 'عميلة سعيدة'], ['١٠٠٪', 'أصلية مضمونة'], ['٤٨س', 'توصيل سريع']].map(([num, label]) => (
            <div key={label}>
              <p className="text-rose-gold font-bold text-xl sm:text-2xl">{num}</p>
              <p className="text-white/55 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* سهم أسفل */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-white/40">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* ══════════════ المنتج المميز ══════════════ */}
      {featuredProduct && <FeaturedProductBanner product={featuredProduct} />}

      {/* ══════════════ المنتجات المميزة ══════════════ */}
      <section id="products" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* رأس القسم */}
        <div className="text-center mb-16">
          <span className="inline-block text-rose-gold text-xs font-semibold tracking-[0.25em] mb-3 uppercase">
            ✦ مختارة بعناية ✦
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">منتجاتنا المميزة</h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-12 h-px bg-rose-gold/40" />
            <div className="w-3 h-px bg-rose-gold" />
            <div className="w-12 h-px bg-rose-gold/40" />
          </div>
        </div>

        {/* شبكة على الكمبيوتر — شريط أفقي على الهاتف */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} rating={p.rating} badge={p.badge} image={p.imageUrl} />
          ))}
        </div>

        {/* شريط سحب أفقي على الهاتف */}
        <div className="sm:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide flex gap-3 pb-2">
          {featuredProducts.map((p) => (
            <MobileProductCard key={p.id} id={p.id} name={p.name} price={p.price} badge={p.badge} image={p.imageUrl} />
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 border border-rose-gold/60 hover:border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-white font-semibold px-10 py-3.5 rounded-full transition-all duration-300 text-sm"
          >
            عرض جميع المنتجات
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 rotate-180">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ══════════════ لماذا لمسة؟ ══════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-rose-gold text-xs font-semibold tracking-[0.25em] mb-3 uppercase">
              ✦ ثقتكِ أولويتنا ✦
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">لماذا لمسة؟</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-white/8 hover:bg-white/14 backdrop-blur-md border border-white/15 hover:border-rose-gold/40 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-2xl bg-rose-gold/15 group-hover:bg-rose-gold/25 flex items-center justify-center mx-auto mb-5 text-rose-gold transition-colors duration-300">
                  {f.icon}
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{f.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ عن لمسة ══════════════ */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* النص */}
          <div>
            <span className="inline-block text-rose-gold text-xs font-semibold tracking-[0.25em] mb-4 uppercase">✦ قصتنا ✦</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-snug">
              نؤمن بأن لكلّ امرأة
              <br />
              <span className="text-rose-gold">لمستها الخاصة</span>
            </h2>
            <p className="text-white/70 leading-relaxed mb-4 text-base">
              وُلدت لمسة من شغف حقيقي بعالم التجميل والأناقة. نؤمن بأن المرأة العراقية تستحق منتجات عالية الجودة تُبرز جمالها الطبيعي وتُعبّر عن شخصيتها الفريدة.
            </p>
            <p className="text-white/70 leading-relaxed mb-10 text-base">
              نختار كل منتج بعناية فائقة، مع الحرص على أن تكون المكوّنات آمنة وفعّالة وملائمة لبشرة المرأة العربية.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-rose-gold font-semibold hover:gap-3 transition-all duration-200 text-sm">
              اعرفي المزيد عنّا
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 rotate-180">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

          {/* البطاقة الزجاجية */}
          <div className="relative pt-4 pb-8">
            <div className="absolute -top-2 -left-2 w-full h-full rounded-3xl border border-white/10 pointer-events-none" />
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden aspect-[4/5] flex items-center justify-center">
              <div className="text-center p-10">
                <div className="w-28 h-28 rounded-full bg-rose-gold/20 border border-rose-gold/30 flex items-center justify-center mx-auto mb-6">
                  <span className="text-6xl">✨</span>
                </div>
                <p className="text-white font-bold text-2xl mb-1">منذ ٢٠٢٤</p>
                <p className="text-white/55 text-sm">نُجمّل حياة المرأة العراقية</p>
              </div>
            </div>
            {/* بطاقة إحصائية */}
            <div className="absolute -bottom-2 right-6 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 flex items-center gap-5">
              <div className="text-center">
                <p className="text-2xl font-bold text-rose-gold">+٥٠٠٠</p>
                <p className="text-[11px] text-white/55">عميلة سعيدة</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-rose-gold">١٠٠٪</p>
                <p className="text-[11px] text-white/55">منتجات أصلية</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto bg-white/8 backdrop-blur-md border border-white/15 rounded-3xl px-8 py-16 text-center">
          <span className="inline-block text-rose-gold text-xs font-semibold tracking-[0.25em] mb-4 uppercase">✦ عرض خاص ✦</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            خصم ١٥٪ على أول طلب
          </h2>
          <p className="text-white/65 mb-10 max-w-sm mx-auto leading-relaxed">
            سجّلي بريدكِ الإلكتروني الآن واحصلي على كود الخصم الخاص فوراً
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="بريدكِ الإلكتروني"
              className="flex-1 bg-white/10 border border-white/20 focus:border-rose-gold text-white placeholder:text-white/35 rounded-full px-5 py-3.5 text-sm outline-none transition-colors duration-200"
            />
            <button
              type="submit"
              className="bg-rose-gold hover:bg-rose-gold/90 text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-300 hover:shadow-lg hover:shadow-rose-gold/30 whitespace-nowrap"
            >
              أرسلي لي الكود
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
