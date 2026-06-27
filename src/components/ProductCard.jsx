import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import { useCart } from '../context/CartContext'
import { useToast } from './Toast'

export default function ProductCard({ id, name, price, badge, image, rating }) {
  const { addToCart } = useCart()
  const showToast = useToast()

  function handleAdd(e) {
    e.preventDefault()
    addToCart({ id, name, price, image })
    showToast('تمت الإضافة إلى السلة ✓')
  }

  return (
    <Link
      to={id ? `/products/${id}` : '#'}
      className="group relative bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-rose-gold/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/30 block"
    >
      {/* الصورة */}
      <div className="relative overflow-hidden aspect-square">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-white/3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-8 h-8 opacity-25">
              <circle cx="32" cy="20" r="10" fill="#C9956C" />
              <ellipse cx="32" cy="46" rx="18" ry="10" fill="#F2D1C9" opacity="0.4" />
              <rect x="22" y="30" width="20" height="18" rx="4" fill="#C9956C" opacity="0.7" />
            </svg>
            <span className="text-[10px] text-rose-gold/30 font-medium">لمسة</span>
          </div>
        )}

        {badge && (
          <span className="absolute top-3 right-3 bg-rose-gold text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
            {badge}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="w-full bg-deep-plum/80 backdrop-blur-sm text-white text-xs font-semibold py-2.5 text-center">
            عرض التفاصيل ←
          </div>
        </div>
      </div>

      {/* المعلومات */}
      <div className="p-4">
        {rating && <StarRating rating={rating} />}
        <h3 className="font-semibold text-white text-sm mt-2 mb-3 line-clamp-2 leading-snug">{name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-rose-gold font-bold text-base">{(price ?? 0).toLocaleString('ar-IQ')} د.ع</span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-rose-gold hover:bg-rose-gold/90 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-full transition-all duration-200 hover:shadow-rose-gold/30 hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.43 3h8.57a1.75 1.75 0 011.74 1.98l-.537 3.5A1.75 1.75 0 0113.46 10H6.796l.212 1.492A.25.25 0 007.254 12h7.496a.75.75 0 010 1.5H7.254a1.75 1.75 0 01-1.731-1.456L3.977 3.97A.25.25 0 003.728 3.5H1.75A.75.75 0 011 1.75z" />
              <path d="M9 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
            للسلة
          </button>
        </div>
      </div>
    </Link>
  )
}
