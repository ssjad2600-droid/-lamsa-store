import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'
import { generateOrderMessage, openWhatsApp } from '../utils/whatsapp'

const DELIVERY = 5000

const PROVINCES = [
  'بغداد','البصرة','أربيل','الموصل','النجف','كربلاء',
  'السليمانية','الأنبار','ديالى','صلاح الدين','ذي قار',
  'المثنى','القادسية','ميسان','واسط','بابل','كركوك','دهوك',
]

/* ── Stepper ── */
const STEPS = ['معلومات التوصيل', 'مراجعة الطلب', 'تأكيد الطلب']

function Stepper({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12 select-none">
      {STEPS.map((label, i) => {
        const done   = i < current
        const active = i === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                done   ? 'bg-rose-gold border-rose-gold text-white'
                : active ? 'bg-transparent border-rose-gold text-rose-gold shadow-lg shadow-rose-gold/30'
                : 'bg-white/10 border-white/20 text-white/40'
              }`}>
                {done ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                ) : i + 1}
              </div>
              <span className={`text-[11px] font-medium whitespace-nowrap ${active ? 'text-rose-gold' : done ? 'text-white/70' : 'text-white/30'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-16 sm:w-24 h-px mx-2 mb-5 transition-colors duration-300 ${done ? 'bg-rose-gold' : 'bg-white/15'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── حقل إدخال ── */
function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-white/70 text-sm mb-1.5">
        {label}{required && <span className="text-rose-gold mr-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">⚠ {error}</p>}
    </div>
  )
}

const inputCls = (err) =>
  `w-full bg-white/10 backdrop-blur-sm border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none transition-all duration-200 focus:bg-white/15 ${
    err ? 'border-red-400/60 focus:border-red-400' : 'border-white/20 focus:border-rose-gold'
  }`

/* ── التحقق ── */
function validate(form) {
  const errs = {}
  if (!form.name.trim() || form.name.trim().length < 3)
    errs.name = 'الاسم يجب أن يكون 3 أحرف على الأقل'
  if (!/^07\d{9}$/.test(form.phone.trim()))
    errs.phone = 'رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 11 رقماً'
  if (!form.province)
    errs.province = 'يرجى اختيار المحافظة'
  if (!form.address.trim() || form.address.trim().length < 10)
    errs.address = 'العنوان يجب أن يكون 10 أحرف على الأقل'
  return errs
}

/* ── الخطوة 1: النموذج ── */
function Step1({ form, setForm, onNext }) {
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (touched[name]) {
      const errs = validate({ ...form, [name]: value })
      setErrors((prev) => ({ ...prev, [name]: errs[name] }))
    }
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    const errs = validate({ ...form, [name]: e.target.value })
    setErrors((prev) => ({ ...prev, [name]: errs[name] }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    setTouched({ name: true, phone: true, province: true, address: true })
    if (Object.keys(errs).length === 0) onNext()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="الاسم الكامل" required error={errors.name}>
          <input name="name" value={form.name} onChange={handleChange} onBlur={handleBlur}
            placeholder="مثال: فاطمة أحمد" className={inputCls(errors.name)} />
        </Field>
        <Field label="رقم الهاتف" required error={errors.phone}>
          <input name="phone" value={form.phone} type="tel" onChange={handleChange} onBlur={handleBlur}
            placeholder="07XXXXXXXXX" className={inputCls(errors.phone)} dir="ltr" />
        </Field>
      </div>

      <Field label="المحافظة" required error={errors.province}>
        <select name="province" value={form.province} onChange={handleChange} onBlur={handleBlur}
          className={`${inputCls(errors.province)} cursor-pointer`}>
          <option value="" className="bg-deep-plum">اختيار المحافظة...</option>
          {PROVINCES.map((p) => <option key={p} value={p} className="bg-deep-plum">{p}</option>)}
        </select>
      </Field>

      <Field label="العنوان التفصيلي" required error={errors.address}>
        <textarea name="address" value={form.address} rows={3} onChange={handleChange} onBlur={handleBlur}
          placeholder="الحي، الشارع، رقم المنزل..." className={`${inputCls(errors.address)} resize-none`} />
      </Field>

      <Field label="ملاحظات للتوصيل (اختياري)">
        <textarea name="notes" value={form.notes} rows={2} onChange={handleChange}
          placeholder="أي تعليمات خاصة للمندوب..." className={`${inputCls(false)} resize-none`} />
      </Field>

      <button type="submit"
        className="w-full bg-rose-gold hover:bg-rose-gold/90 text-white font-bold py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-rose-gold/30 hover:-translate-y-0.5 mt-2">
        التالي ←
      </button>
    </form>
  )
}

/* ── الخطوة 2: المراجعة ── */
function Step2({ form, items, totalPrice, onConfirm, onBack }) {
  const total = totalPrice + DELIVERY
  return (
    <div className="flex flex-col gap-6">
      {/* المنتجات */}
      <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10">
          <h3 className="text-white font-semibold text-sm">المنتجات المطلوبة</h3>
        </div>
        <div className="divide-y divide-white/10">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-5 py-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="w-6 h-6 opacity-50">
                      <circle cx="20" cy="13" r="6" fill="#C9956C" />
                      <rect x="14" y="19" width="12" height="11" rx="2" fill="#C9956C" opacity="0.7" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium line-clamp-1">{item.name}</p>
                <p className="text-white/45 text-xs">الكمية: {item.qty}</p>
              </div>
              <p className="text-rose-gold text-sm font-bold flex-shrink-0">
                {(item.price * item.qty).toLocaleString('ar-IQ')} د.ع
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ملخص السعر */}
      <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col gap-3 text-sm">
        {[['المجموع الفرعي', totalPrice], ['التوصيل', DELIVERY]].map(([label, val]) => (
          <div key={label} className="flex justify-between text-white/65">
            <span>{label}</span><span>{val.toLocaleString('ar-IQ')} د.ع</span>
          </div>
        ))}
        <div className="h-px bg-white/15" />
        <div className="flex justify-between text-white font-bold text-base">
          <span>المجموع الكلي</span>
          <span className="text-rose-gold text-lg">{total.toLocaleString('ar-IQ')} د.ع</span>
        </div>
      </div>

      {/* معلومات التوصيل */}
      <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-5">
        <h3 className="text-white font-semibold text-sm mb-3">عنوان التوصيل</h3>
        <div className="flex flex-col gap-1.5 text-sm text-white/65">
          {[['الاسم', form.name], ['الهاتف', form.phone], ['المحافظة', form.province], ['العنوان', form.address]].map(([k, v]) => (
            <p key={k}><span className="text-white/40 ml-2">{k}:</span>{v}</p>
          ))}
          {form.notes && <p><span className="text-white/40 ml-2">ملاحظات:</span>{form.notes}</p>}
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <button onClick={onBack}
          className="flex-1 border border-white/20 hover:border-rose-gold/40 text-white/70 hover:text-white font-semibold py-3.5 rounded-full transition-all duration-200 text-sm">
          ← رجوع
        </button>
        <button onClick={onConfirm}
          className="flex-[2] bg-rose-gold hover:bg-rose-gold/90 text-white font-bold py-3.5 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-rose-gold/30 hover:-translate-y-0.5 text-sm">
          تأكيد الطلب ✓
        </button>
      </div>
    </div>
  )
}

/* ── الخطوة 3: التأكيد ── */
function Step3({ orderNum, whatsappUrl, onFinish }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col items-center text-center py-8 gap-6">
      {/* أيقونة صح متحركة */}
      <div className={`transition-all duration-700 ${show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <div className="w-28 h-28 rounded-full bg-rose-gold/20 border-2 border-rose-gold flex items-center justify-center shadow-2xl shadow-rose-gold/30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#C9956C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14">
            <path d="M4 13l5 5L20 7" style={{ strokeDasharray: 30, strokeDashoffset: show ? 0 : 30, transition: 'stroke-dashoffset 0.6s ease 0.3s' }} />
          </svg>
        </div>
      </div>

      <div className={`transition-all duration-500 delay-300 ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <p className="text-rose-gold text-sm font-semibold tracking-widest mb-2">✦ تم استلام طلبكِ ✦</p>
        <h2 className="text-3xl font-bold text-white mb-2">شكراً لكِ!</h2>
        <p className="text-white/60 text-sm max-w-xs mx-auto leading-relaxed">
          سيتواصل معكِ فريقنا خلال ساعة لتأكيد طلبكِ وتحديد موعد التوصيل
        </p>
      </div>

      {/* تفاصيل الطلب */}
      <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-5 w-full max-w-sm flex flex-col gap-3 text-sm transition-all duration-500 delay-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {[
          ['رقم الطلب', orderNum, 'text-rose-gold font-bold tracking-wider'],
          ['وقت التوصيل المتوقع', '٢–٤ أيام عمل', 'text-white font-semibold'],
          ['طريقة الدفع', 'عند الاستلام', 'text-white font-semibold'],
        ].map(([label, val, cls], i, arr) => (
          <div key={label}>
            <div className="flex justify-between items-center">
              <span className="text-white/50">{label}</span>
              <span className={cls}>{val}</span>
            </div>
            {i < arr.length - 1 && <div className="h-px bg-white/10 mt-3" />}
          </div>
        ))}
      </div>

      {/* أزرار */}
      <div className={`flex flex-col gap-3 w-full max-w-sm transition-all duration-500 delay-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* واتساب */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#22c35e] text-white font-bold py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          إعادة فتح واتساب
        </a>

        <button onClick={onFinish}
          className="w-full border border-white/20 hover:border-rose-gold/50 text-white/70 hover:text-white font-semibold py-3.5 rounded-full transition-all duration-200 text-sm backdrop-blur-sm">
          متابعة التسوق
        </button>
      </div>
    </div>
  )
}

/* ══ الصفحة الرئيسية ══ */
export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [orderNum] = useState(`#LMS${Math.floor(1000 + Math.random() * 9000)}`)
  const [form, setForm] = useState({ name: '', phone: '', province: '', address: '', notes: '' })
  const [whatsappUrl, setWhatsappUrl] = useState('')

  useEffect(() => {
    if (items.length === 0 && step < 2) navigate('/cart')
  }, [items.length, step, navigate])

  function handleConfirm() {
    const url = generateOrderMessage({
      customerInfo: form,
      cartItems: items,
      totalPrice,
      orderNumber: orderNum,
    })
    setWhatsappUrl(url)
    openWhatsApp(url)
    setStep(2)
  }

  function handleFinish() {
    clearCart()
    navigate('/')
  }

  return (
    <div className="min-h-screen font-arabic" dir="rtl">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        <div className="text-center mb-10">
          <span className="inline-block text-rose-gold text-xs font-semibold tracking-[0.25em] mb-2 uppercase">✦ إتمام الطلب ✦</span>
          <h1 className="text-3xl font-bold text-white">تأكيد طلبكِ</h1>
        </div>

        <Stepper current={step} />

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8">
          {step === 0 && <Step1 form={form} setForm={setForm} onNext={() => setStep(1)} />}
          {step === 1 && (
            <Step2
              form={form} items={items} totalPrice={totalPrice}
              onConfirm={handleConfirm} onBack={() => setStep(0)}
            />
          )}
          {step === 2 && <Step3 orderNum={orderNum} whatsappUrl={whatsappUrl} onFinish={handleFinish} />}
        </div>

        {step < 2 && (
          <p className="text-center text-white/30 text-xs mt-6">🔒 جميع بياناتكِ محمية وآمنة</p>
        )}
      </div>
    </div>
  )
}
