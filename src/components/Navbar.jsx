import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const navLinks = [
  { label: 'الرئيسية',   to: '/'          },
  { label: 'المنتجات',   to: '/products'  },
  { label: 'عن لمسة',   to: '/about'     },
  { label: 'تواصل معنا', to: '/about#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { totalItems } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // إغلاق القائمة عند تغيير الصفحة
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  return (
    <nav
      style={{
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease',
        background: scrolled ? 'rgba(74,25,66,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.25)' : 'none',
      }}
      className="fixed top-0 right-0 left-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">

          {/* شعار */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-[26px] font-bold text-rose-gold tracking-wide drop-shadow group-hover:opacity-90 transition-opacity">
              لمسة
            </span>
            <span className="hidden sm:block text-white/30 text-xs font-light mt-1 tracking-widest">
              LAMSA
            </span>
          </Link>

          {/* روابط — سطح المكتب */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className={`relative text-sm font-medium transition-colors duration-200
                      after:absolute after:bottom-[-4px] after:right-0 after:h-[1.5px]
                      after:bg-rose-gold after:transition-all after:duration-300
                      ${isActive
                        ? 'text-rose-gold after:w-full'
                        : 'text-white/85 hover:text-rose-gold after:w-0 hover:after:w-full'
                      }`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* سلة + هامبرغر */}
          <div className="flex items-center gap-4">
            <Link to="/cart" aria-label="سلة التسوق" className="relative text-white/85 hover:text-rose-gold transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -left-1.5 bg-rose-gold text-white text-[10px] min-w-[18px] h-[18px] px-0.5 rounded-full flex items-center justify-center font-bold leading-none">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            <button
              aria-label="القائمة"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white/85 hover:text-rose-gold transition-colors duration-200 p-1"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* القائمة المنسدلة — جوال */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ background: 'rgba(74,25,66,0.96)', backdropFilter: 'blur(16px)' }}
      >
        <ul className="flex flex-col px-6 py-5 gap-1">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className="block text-sm font-medium text-white/85 hover:text-rose-gold transition-colors duration-200 border-b border-white/10 py-3"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
