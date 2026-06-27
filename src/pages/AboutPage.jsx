import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getInquiryLink, WHATSAPP_NUMBER } from '../utils/whatsapp'

const values = [
  {
    icon: '💎',
    title: 'الأصالة',
    desc: 'نختار منتجاتنا بعناية فائقة من أفضل العلامات التجارية العالمية. كل منتج يمر بفحص صارم قبل وصوله إليكِ.',
  },
  {
    icon: '✨',
    title: 'الجودة',
    desc: 'لا نتهاون في الجودة أبداً. نضمن لكِ منتجات أصلية 100% مع إمكانية الإرجاع خلال 7 أيام.',
  },
  {
    icon: '🤝',
    title: 'الثقة',
    desc: 'بنينا علاقتنا مع أكثر من 5000 زبونة على أساس الشفافية والصدق. ثقتكِ بنا هي أغلى ما نملك.',
  },
]

const socialLinks = [
  {
    label: 'واتساب',
    sub: `+${WHATSAPP_NUMBER}`,
    href: getInquiryLink(),
    color: '#25D366',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: 'إنستغرام',
    sub: '@lamsa.iq',
    href: '#',
    color: '#E4405F',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'الموقع',
    sub: 'البصرة، العراق',
    href: '#',
    color: '#C9956C',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen font-arabic" dir="rtl">
      <Navbar />

      {/* ══ Hero ══ */}
      <section className="min-h-[55vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        <span className="inline-block text-rose-gold text-xs font-semibold tracking-[0.25em] mb-4 uppercase">✦ قصتنا ✦</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
          عن <span className="text-rose-gold">لمسة</span>
        </h1>
        <p className="text-white/70 text-base sm:text-lg max-w-xl leading-relaxed">
          وُلدت لمسة من حب حقيقي لعالم التجميل وإيمان عميق بأن كل امرأة تستحق أن تشعر بجمالها وأناقتها كل يوم
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 flex flex-col gap-20">

        {/* ══ قصة لمسة ══ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* البطاقة البصرية */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-3 -left-3 w-full h-full rounded-3xl border border-white/10 pointer-events-none" />
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 flex flex-col items-center text-center gap-5">
              <div className="w-24 h-24 rounded-full bg-rose-gold/20 border border-rose-gold/30 flex items-center justify-center text-5xl">
                🌸
              </div>
              <div>
                <p className="text-white font-bold text-2xl">منذ ٢٠٢٤</p>
                <p className="text-white/50 text-sm mt-1">البصرة، العراق</p>
              </div>
              <div className="w-full h-px bg-white/10" />
              <div className="grid grid-cols-2 gap-6 w-full">
                {[['٥٠٠٠+', 'زبونة سعيدة'], ['١٢+', 'منتج مميز'], ['١٠٠٪', 'أصلية مضمونة'], ['٤٨س', 'توصيل سريع']].map(([num, label]) => (
                  <div key={label} className="text-center">
                    <p className="text-rose-gold font-bold text-xl">{num}</p>
                    <p className="text-white/45 text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* النص */}
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5 leading-snug">
              كيف بدأت
              <br /><span className="text-rose-gold">لمسة؟</span>
            </h2>
            <div className="flex flex-col gap-4 text-white/70 text-base leading-relaxed">
              <p>
                بدأت لمسة كحلم صغير في البصرة — حلم بأن تجد كل امرأة عراقية منتجات تجميل عالية الجودة وأصلية 100% دون أن تقلق من التقليد أو الغش.
              </p>
              <p>
                كنّا نشاهد حولنا كيف تعاني النساء للعثور على منتجات موثوقة، فقرّرنا أن نكون الحل. بدأنا بمجموعة صغيرة من المنتجات المختارة بعناية، ونمونا مع ثقة زبوناتنا الغاليات.
              </p>
              <p>
                اليوم، نفخر بخدمة أكثر من 5000 زبونة من مختلف محافظات العراق، ونواصل السعي لتقديم الأفضل دائماً.
              </p>
            </div>
          </div>
        </section>

        {/* ══ قيمنا ══ */}
        <section>
          <div className="text-center mb-12">
            <span className="inline-block text-rose-gold text-xs font-semibold tracking-[0.25em] mb-3 uppercase">✦ ما نؤمن به ✦</span>
            <h2 className="text-3xl font-bold text-white">قيمنا</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title}
                className="group bg-white/8 hover:bg-white/13 backdrop-blur-md border border-white/15 hover:border-rose-gold/40 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1">
                <div className="text-5xl mb-5">{v.icon}</div>
                <h3 className="text-white font-bold text-xl mb-3">{v.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ تواصلي معنا ══ */}
        <section id="contact">
          <div className="text-center mb-12">
            <span className="inline-block text-rose-gold text-xs font-semibold tracking-[0.25em] mb-3 uppercase">✦ نحن هنا ✦</span>
            <h2 className="text-3xl font-bold text-white">تواصلي معنا</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="group bg-white/8 hover:bg-white/13 backdrop-blur-md border border-white/15 hover:border-white/30 rounded-2xl p-6 flex flex-col items-center gap-3 text-center transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300"
                  style={{ background: `${s.color}20`, color: s.color }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{s.label}</p>
                  <p className="text-white/50 text-xs mt-0.5" dir="ltr">{s.sub}</p>
                </div>
              </a>
            ))}
          </div>

          {/* زر واتساب رئيسي */}
          <div className="text-center">
            <a
              href={getInquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#22c35e] text-white font-bold px-10 py-4 rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/30 hover:-translate-y-0.5 text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              تحدثي معنا على واتساب
            </a>
            <p className="text-white/35 text-xs mt-3">نرد خلال ساعة في أوقات العمل</p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
