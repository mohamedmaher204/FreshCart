import React from 'react'

export default function page() {
  return (
    <div>page</div>
  )
}

// ملحوظة هامة جداً (لتشغيل الدفع الحقيقي):
// بما إن ده حساب Stripe خاص بيك، لازم تضيف مفاتيح الـ API الخاصة بيك من لوحة تحكم Stripe (في وضع الـ Test حالياً) في ملف الـ 
// .env
// :

// STRIPE_SECRET_KEY: (المفتاح السري)
// NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: (المفتاح العام)