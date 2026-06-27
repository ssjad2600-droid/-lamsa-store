import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebase'
import AdminLayout from '../../components/admin/AdminLayout'

const CATEGORY_COLORS = {
  'مكياج':           { bg: 'bg-pink-50',   text: 'text-pink-600',   dot: 'bg-pink-400' },
  'العناية بالبشرة': { bg: 'bg-blue-50',   text: 'text-blue-600',   dot: 'bg-blue-400' },
  'العطور':          { bg: 'bg-purple-50',  text: 'text-purple-600', dot: 'bg-purple-400' },
  'العناية بالشعر':  { bg: 'bg-amber-50',  text: 'text-amber-600',  dot: 'bg-amber-400' },
}

function StatCard({ title, value, sub, icon, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
        {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      if (!db) {
        setError('Firebase غير مهيأ — تحقق من ملف .env')
        setLoading(false)
        return
      }
      try {
        const snap = await getDocs(collection(db, 'products'))
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch (err) {
        setError('فشل تحميل البيانات: ' + (err.message || err.code || 'خطأ غير معروف'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // إحصائيات الفئات
  const byCat = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})

  const avgPrice = products.length
    ? Math.round(products.reduce((s, p) => s + (p.price || 0), 0) / products.length)
    : 0

  return (
    <AdminLayout>
      <div className="p-8">
        {/* رأس الصفحة */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">لوحة التحكم</h2>
          <p className="text-gray-400 text-sm mt-1">مرحباً بكِ في إدارة متجر لمسة</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <svg className="animate-spin w-8 h-8 text-[#C9956C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <>
            {/* إحصائيات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="إجمالي المنتجات"
                value={products.length}
                sub="منتج في المتجر"
                color="bg-[#4A1942]/10"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4A1942" className="w-6 h-6">
                    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
                    <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087z" clipRule="evenodd" />
                  </svg>
                }
              />
              <StatCard
                title="متوسط السعر"
                value={`${avgPrice.toLocaleString('ar-IQ')} د.ع`}
                sub="لكل منتج"
                color="bg-[#C9956C]/10"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#C9956C" className="w-6 h-6">
                    <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.756V6z" clipRule="evenodd" />
                  </svg>
                }
              />
              <StatCard
                title="الفئات"
                value={Object.keys(byCat).length}
                sub="فئة مختلفة"
                color="bg-blue-50"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" className="w-6 h-6">
                    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
                  </svg>
                }
              />
              <StatCard
                title="أعلى تقييم"
                value={products.length ? Math.max(...products.map((p) => p.rating || 0)).toFixed(1) + ' ★' : '—'}
                sub="من أصل 5"
                color="bg-amber-50"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f59e0b" className="w-6 h-6">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                }
              />
            </div>

            {/* توزيع الفئات */}
            {Object.keys(byCat).length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-5">توزيع المنتجات حسب الفئة</h3>
                <div className="flex flex-col gap-3">
                  {Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                    const colors = CATEGORY_COLORS[cat] || { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' }
                    const pct = Math.round((count / products.length) * 100)
                    return (
                      <div key={cat} className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 w-40 flex-shrink-0 px-3 py-1.5 rounded-lg ${colors.bg}`}>
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                          <span className={`text-sm font-medium ${colors.text}`}>{cat}</span>
                        </div>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-[#C9956C] transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-gray-500 text-sm w-14 text-left">{count} منتج</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* رسالة إذا لا يوجد منتجات */}
            {products.length === 0 && (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto mb-3 opacity-30">
                  <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
                  <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087z" clipRule="evenodd" />
                </svg>
                <p className="font-medium">لا توجد منتجات بعد</p>
                <p className="text-sm mt-1">أضيفي منتجاتك من صفحة المنتجات</p>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  )
}
