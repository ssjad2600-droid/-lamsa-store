import { useState, useEffect, useRef } from 'react'
import {
  collection, getDocs, addDoc, setDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import { products as staticProducts } from '../../data/products'
import AdminLayout from '../../components/admin/AdminLayout'

const PLACEHOLDER = 'https://via.placeholder.com/300x300?text=%D9%84%D9%85%D8%B3%D8%A9'

async function uploadImage(file) {
  console.log('بدء رفع الصورة...')
  console.log('ImgBB API Key:', import.meta.env.VITE_IMGBB_API_KEY)

  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    { method: 'POST', body: formData }
  )
  const data = await res.json()
  console.log('نتيجة ImgBB:', data)
  if (!res.ok || !data.data?.url) throw new Error('فشل رفع الصورة: ' + JSON.stringify(data))
  return data.data.url
}

const CATEGORIES = ['مكياج', 'العناية بالبشرة', 'العطور', 'العناية بالشعر']

const EMPTY_FORM = { name: '', category: '', price: '', desc: '', rating: '4.5', imageUrl: '' }

/* ── نجوم التقييم ── */
function Stars({ value }) {
  return (
    <span className="text-amber-400 text-sm">
      {'★'.repeat(Math.floor(value))}{'☆'.repeat(5 - Math.floor(value))}
      <span className="text-gray-400 text-xs mr-1">{value}</span>
    </span>
  )
}

/* ── Modal إضافة/تعديل ── */
function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product ? { ...product, price: String(product.price), rating: String(product.rating) } : EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || '')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const fileRef = useRef()
  const modalBodyRef = useRef()

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }))
  }

  function handleImage(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'مطلوب'
    if (!form.category) errs.category = 'مطلوب'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'سعر صحيح مطلوب'
    if (!form.desc.trim()) errs.desc = 'مطلوب'
    const r = Number(form.rating)
    if (isNaN(r) || r < 1 || r > 5) errs.rating = 'بين 1 و 5'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    console.log('بدء الحفظ...')
    console.log('بيانات المنتج:', form)
    console.log('هل يوجد صورة:', imageFile)
    try {
      let imageUrl = form.imageUrl || ''
      if (imageFile) imageUrl = await uploadImage(imageFile)
      if (!imageUrl) imageUrl = PLACEHOLDER

      const data = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        desc: form.desc.trim(),
        rating: Number(form.rating),
        imageUrl,
      }

      if (product?.id) {
        // merge: true يحافظ على featured/deleted وغيرها من الحقول غير الموجودة في data
        await setDoc(doc(db, 'products', String(product.id)), { ...data, updatedAt: serverTimestamp() }, { merge: true })
      } else {
        // إضافة جديدة: Firestore يولد ID تلقائياً
        await addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() })
      }

      onSave()
    } catch (error) {
      console.error('خطأ في الحفظ — الكود:', error.code, '— الرسالة:', error.message, error)
      const msg = error.message || error.code || 'خطأ غير معروف'
      setErrors({ _: 'حدث خطأ أثناء الحفظ: ' + msg })
      // مرر النموذج للأعلى حتى يرى المستخدم رسالة الخطأ
      setTimeout(() => modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 50)
    } finally {
      setSaving(false)
    }
  }

  const labelCls = 'block text-sm font-semibold text-[#4A1942] mb-1.5'
  const inputCls = (err) =>
    `w-full border-2 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white placeholder:text-gray-400 outline-none transition-all duration-200 ${
      err
        ? 'border-red-400 bg-red-50/30 focus:border-red-500'
        : 'border-gray-200 focus:border-[#C9956C] focus:bg-[#C9956C]/5'
    }`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div ref={modalBodyRef} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

        {/* رأس المودال */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#4A1942] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C9956C] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="font-bold text-white text-lg">{product ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {errors._ && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {errors._}
            </div>
          )}

          {/* صورة المنتج */}
          <div>
            <label className={labelCls}>صورة المنتج <span className="text-gray-400 font-normal text-xs">(اختياري)</span></label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-[#C9956C] hover:bg-[#C9956C]/5 rounded-xl p-4 cursor-pointer transition-all duration-200 flex items-center gap-4 group"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="" className="w-16 h-16 object-cover rounded-xl flex-shrink-0 ring-2 ring-[#C9956C]/30" />
              ) : (
                <div className="w-16 h-16 bg-[#4A1942]/8 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#C9956C]/15 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[#4A1942]/40 group-hover:text-[#C9956C] transition-colors">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-700 font-semibold group-hover:text-[#C9956C] transition-colors">اضغطي لاختيار صورة</p>
                <p className="text-xs text-gray-500 mt-0.5">JPG، PNG، WEBP — حد أقصى 5MB</p>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>

          {/* الاسم */}
          <div>
            <label className={labelCls}>اسم المنتج <span className="text-[#C9956C]">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="مثال: أحمر شفاه روز" className={inputCls(errors.name)} />
            {errors.name && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠ {errors.name}</p>}
          </div>

          {/* الفئة والسعر */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>الفئة <span className="text-[#C9956C]">*</span></label>
              <select name="category" value={form.category} onChange={handleChange} className={`${inputCls(errors.category)} cursor-pointer`}>
                <option value="" className="text-gray-400">— اختيار الفئة —</option>
                {CATEGORIES.map((c) => <option key={c} value={c} className="text-gray-900">{c}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠ {errors.category}</p>}
            </div>
            <div>
              <label className={labelCls}>السعر (د.ع) <span className="text-[#C9956C]">*</span></label>
              <input name="price" value={form.price} onChange={handleChange} type="number" min="0" placeholder="15000" className={inputCls(errors.price)} dir="ltr" />
              {errors.price && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠ {errors.price}</p>}
            </div>
          </div>

          {/* الوصف */}
          <div>
            <label className={labelCls}>الوصف <span className="text-[#C9956C]">*</span></label>
            <textarea name="desc" value={form.desc} onChange={handleChange} rows={3}
              placeholder="وصف مختصر وجذاب للمنتج..." className={`${inputCls(errors.desc)} resize-none`} />
            {errors.desc && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠ {errors.desc}</p>}
          </div>

          {/* التقييم */}
          <div>
            <label className={labelCls}>التقييم <span className="text-gray-400 font-normal text-xs">(من 1 إلى 5)</span></label>
            <div className="flex items-center gap-3">
              <input name="rating" value={form.rating} onChange={handleChange} type="number" min="1" max="5" step="0.1"
                className={`${inputCls(errors.rating)} w-28`} dir="ltr" />
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                <Stars value={Number(form.rating) || 0} />
              </div>
            </div>
            {errors.rating && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠ {errors.rating}</p>}
          </div>

          {/* فاصل */}
          <div className="h-px bg-gray-100" />

          {/* أزرار */}
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-all text-sm">
              إلغاء
            </button>
            <button type="submit" disabled={saving}
              className="flex-[2] bg-[#C9956C] hover:bg-[#b8845c] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C9956C]/25">
              {saving ? (
                <>
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  جارٍ الحفظ...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  {product ? 'حفظ التعديلات' : 'إضافة المنتج'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ══ الصفحة الرئيسية ══ */
export default function ProductsManager() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | 'add' | product object
  const [deleting, setDeleting] = useState(null)
  const [featuring, setFeaturing] = useState(null)

  async function fetchProducts() {
    setLoading(true)
    setFetchError('')
    if (!db) {
      // بدون Firebase — اعرض المنتجات الثابتة فقط بدون صلاحيات تعديل
      setProducts(staticProducts)
      setLoading(false)
      return
    }
    try {
      const snap = await getDocs(collection(db, 'products'))
      const firestoreProducts = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

      // دمج الثابتة مع Firestore: Firestore تأخذ الأولوية
      const overrideMap = Object.fromEntries(
        firestoreProducts
          .filter((p) => !p.deleted)
          .filter((p) => staticProducts.some((s) => String(s.id) === String(p.id)))
          .map((p) => [String(p.id), p])
      )
      const deletedIds = new Set(
        firestoreProducts.filter((p) => p.deleted).map((p) => String(p.id))
      )
      const newFromFirestore = firestoreProducts.filter(
        (p) => !p.deleted && !staticProducts.some((s) => String(s.id) === String(p.id))
      )
      const merged = [
        ...staticProducts
          .filter((s) => !deletedIds.has(String(s.id)))
          .map((s) => overrideMap[String(s.id)] || s),
        ...newFromFirestore,
      ]
      setProducts(merged)
    } catch (err) {
      setFetchError('فشل تحميل المنتجات: ' + (err.message || err.code || 'خطأ غير معروف'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  async function handleDelete(id) {
    if (!confirm('هل أنتِ متأكدة من حذف هذا المنتج؟')) return
    setDeleting(id)
    setDeleteError('')
    if (!db) { setDeleteError('Firebase غير مهيأ'); setDeleting(null); return }
    try {
      const isStatic = staticProducts.some((s) => String(s.id) === String(id))
      if (isStatic) {
        // المنتجات الثابتة: علّمها "محذوفة" في Firestore
        await setDoc(doc(db, 'products', String(id)), { deleted: true })
      } else {
        // منتجات Firestore: احذفها نهائياً
        await deleteDoc(doc(db, 'products', String(id)))
      }
      setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)))
    } catch (err) {
      setDeleteError('فشل حذف المنتج: ' + (err.message || err.code || 'خطأ غير معروف'))
    } finally {
      setDeleting(null)
    }
  }

  async function handleToggleFeatured(product) {
    if (!db) { setDeleteError('Firebase غير مهيأ'); return }
    setFeaturing(product.id)
    try {
      const isFeatured = product.featured === true
      if (isFeatured) {
        await setDoc(doc(db, 'products', String(product.id)), { featured: false }, { merge: true })
      } else {
        // أزل التمييز عن الكل أولاً
        const prevFeatured = products.filter((p) => p.featured && String(p.id) !== String(product.id))
        await Promise.all(
          prevFeatured.map((p) => setDoc(doc(db, 'products', String(p.id)), { featured: false }, { merge: true }))
        )
        await setDoc(doc(db, 'products', String(product.id)), { featured: true }, { merge: true })
      }
      await fetchProducts()
    } catch (err) {
      setDeleteError('فشل تعديل المنتج المميز: ' + (err.message || err.code))
    } finally {
      setFeaturing(null)
    }
  }

  function handleModalClose() { setModal(null) }
  function handleModalSave() { setModal(null); fetchProducts() }

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.includes(search)
  )

  return (
    <AdminLayout>
      <div className="p-8" dir="rtl">
        {/* رأس */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">إدارة المنتجات</h2>
            <p className="text-gray-400 text-sm mt-1">{products.length} منتج في المتجر</p>
          </div>
          <button
            onClick={() => setModal('add')}
            className="flex items-center gap-2 bg-[#C9956C] hover:bg-[#b8845c] text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-[#C9956C]/25 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            إضافة منتج
          </button>
        </div>

        {/* رسائل الخطأ */}
        {fetchError && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {fetchError}
          </div>
        )}
        {deleteError && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {deleteError}
            </div>
            <button onClick={() => setDeleteError('')} className="text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        {/* بحث */}
        <div className="relative mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
            className="w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2 right-3.5 pointer-events-none">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
          </svg>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم المنتج أو الفئة..."
            className="w-full border border-gray-200 rounded-xl pr-9 pl-4 py-2.5 text-sm outline-none focus:border-[#C9956C] focus:ring-2 focus:ring-[#C9956C]/10 transition-all bg-white"
          />
        </div>

        {/* جدول */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <svg className="animate-spin w-8 h-8 text-[#C9956C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 mx-auto mb-3 opacity-30">
                <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
                <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087z" clipRule="evenodd" />
              </svg>
              {search ? 'لا توجد نتائج للبحث' : 'لا توجد منتجات بعد'}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['الصورة', 'المنتج', 'الفئة', 'السعر', 'التقييم', 'مميز', 'الإجراءات'].map((h) => (
                    <th key={h} className="text-right text-gray-500 font-semibold px-4 py-3 first:pr-6 last:pl-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* صورة */}
                    <td className="px-4 py-3 pr-6">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                      ) : (
                        <div className="w-10 h-10 bg-[#4A1942]/10 rounded-lg flex items-center justify-center text-[#4A1942]/40 text-lg">✿</div>
                      )}
                    </td>
                    {/* اسم */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{p.name}</p>
                      {p.desc && <p className="text-gray-400 text-xs mt-0.5 line-clamp-1 max-w-[180px]">{p.desc}</p>}
                    </td>
                    {/* فئة */}
                    <td className="px-4 py-3">
                      <span className="bg-[#4A1942]/8 text-[#4A1942] text-xs font-medium px-2.5 py-1 rounded-full">{p.category}</span>
                    </td>
                    {/* سعر */}
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {Number(p.price).toLocaleString('ar-IQ')} <span className="text-gray-400 font-normal">د.ع</span>
                    </td>
                    {/* تقييم */}
                    <td className="px-4 py-3"><Stars value={p.rating || 0} /></td>
                    {/* مميز */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        disabled={featuring === p.id}
                        title={p.featured ? 'إلغاء التمييز' : 'تمييز كمنتج مميز'}
                        className={`p-1.5 rounded-lg transition-all ${
                          p.featured
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                            : 'text-gray-300 hover:text-amber-400 hover:bg-amber-50'
                        } disabled:opacity-50`}
                      >
                        {featuring === p.id ? (
                          <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </td>
                    {/* إجراءات */}
                    <td className="px-4 py-3 pl-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setModal(p)}
                          className="p-1.5 text-gray-400 hover:text-[#C9956C] hover:bg-[#C9956C]/10 rounded-lg transition-all"
                          title="تعديل"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                          title="حذف"
                        >
                          {deleting === p.id ? (
                            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </AdminLayout>
  )
}
