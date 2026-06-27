// غيّري هذا الرقم لرقم واتساب المتجر الحقيقي (صيغة دولية بدون +)
// مثال: 07801234567 → 9647801234567
export const WHATSAPP_NUMBER = '9647724106414'

export function generateOrderMessage({ customerInfo, cartItems, totalPrice, orderNumber }) {
  const itemsList = cartItems
    .map((item) => `• ${item.name} × ${item.qty} = ${(item.price * item.qty).toLocaleString('ar-IQ')} د.ع`)
    .join('\n')

  const notes = customerInfo.notes ? `\nملاحظات: ${customerInfo.notes}` : ''

  const message = `
🌸 *طلب جديد من متجر لمسة*
━━━━━━━━━━━━━━━
📋 *رقم الطلب:* ${orderNumber}

👤 *معلومات الزبونة:*
الاسم: ${customerInfo.name}
الهاتف: ${customerInfo.phone}
المحافظة: ${customerInfo.province}
العنوان: ${customerInfo.address}${notes}

🛍️ *المنتجات المطلوبة:*
${itemsList}

━━━━━━━━━━━━━━━
💰 *المجموع الفرعي:* ${totalPrice.toLocaleString('ar-IQ')} د.ع
🚚 *التوصيل:* ${(5000).toLocaleString('ar-IQ')} د.ع
✅ *المجموع الكلي:* ${(totalPrice + 5000).toLocaleString('ar-IQ')} د.ع
━━━━━━━━━━━━━━━
`.trim()

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function openWhatsApp(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

// رابط استفسار مباشر (بدون طلب)
export function getInquiryLink(text = 'مرحباً، أريد الاستفسار عن منتجاتكم 🌸') {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}
