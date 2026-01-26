'use server'

import { Resend } from 'resend'
import crypto from 'crypto'
import { cookies } from 'next/headers'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
import { getSession } from '@/lib/auth'
import type { Order as OrderType } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmails(order: OrderType) {
  const { productData, contacts, productType } = order
  const { childName, childNameCute, age, birthday } = productData || {}
  const { telegram, email } = contacts || {}

  let itemName = 'музикальних треків'

  if (productType === 'video_greeting') {
    itemName = 'відеопривітання'
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Pani Yulya <noreply@pani-yulya.kids>',
      to: ['kolodyulya@gmail.com'],
      subject: `Нове замовлення ${itemName}`,
      html: `
        <h1>Нове замовлення!</h1>
        ${productType === 'music_track'
          ? `<p><strong>Куплено треків:</strong> ${order.productData?.trackIds?.length || 0}</p>`
          : `<p><strong>Ім'я дитини:</strong> ${childName}</p>
             <p><strong>Пестлива форма імені:</strong> ${childNameCute}</p>
             <p><strong>Вік:</strong> ${age}</p>
             <p><strong>Дата народження:</strong> ${birthday}</p>
             <p><strong>Telegram:</strong> ${telegram}</p>
             <p><strong>Email:</strong> ${email}</p>`}
          `,
    })

    if (error) {
      return { success: false, message: error.message }
    }

    let subject = 'Дякуємо за Ваше замовлення 💛'

    if (productType === 'music_track') {
      subject = 'Дякую Вам за покупку і за підтримку моєї творчості 💛'
    }

    const htmlContent = productType === 'music_track'
      ? `<div style="font-family: Arial, Helvetica, sans-serif; background-color: #fafafa; padding: 24px; color: #1f2937;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px;">
            
            <h1 style="font-size: 22px; margin-bottom: 16px;">
              Дякую за вашу покупку 💛
            </h1>

            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
              Мені дуже приємно, що пісеньки <strong>Пані Юлі</strong> стануть частиною ваших
              сімейних моментів.
            </p>

            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
              ✨ <strong>Ваші пісні вже доступні для завантаження</strong><br />
              Ви можете скачати їх в особистому кабінеті на сайті <strong>Пані Юлі</strong> —
              саме на тому сайті, де ви щойно оформили покупку.
            </p>

            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Завантажуйте пісні на телефон, планшет, комп’ютер або навіть в улюблену
              іграшку дитини — і нехай вони радують вас удома, в дорозі чи на святі 💛
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
              Якщо у вас виникнуть будь-які питання — я завжди поруч і з радістю допоможу.
            </p>

            <p>Ви можете увійти в особистий кабінет за посиланням:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login">Увійти в кабінет</a>

            <p style="font-size: 16px; line-height: 1.6;">
              Обіймаю,<br />
              <strong>Пані Юля</strong> 🌼
            </p>

          </div>

          <p style="text-align: center; font-size: 12px; color: #9ca3af; margin-top: 16px;">
            © Pani Yulya
          </p>
        </div>`
      : `<div style="font-family: Arial, Helvetica, sans-serif; background-color: #fafafa; padding: 24px; color: #1f2937;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px;">
            
            <h1 style="font-size: 22px; margin-bottom: 16px;">
              Дякую за ваше замовлення 🎉
            </h1>

            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
              Мені дуже приємно стати частиною такого особливого дня — 
              <strong>Дня народження вашої дитини</strong> 🎂✨
            </p>

            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
              🎈 <strong>Ваше відеопривітання вже готується</strong><br />
              Я підготую його з любов’ю та увагою до деталей. 
              Замовлення буде виконане впродовж <strong>двох тижнів</strong>.
            </p>

            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Готове відео я надішлю вам у <strong>Telegram</strong> або на 
              <strong>електронну пошту</strong>, яку ви вказали під час оформлення замовлення.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
              Дякую за довіру 💛<br />
              Нехай це привітання подарує вашій дитині усмішку, радість і 
              справжнє відчуття свята ✨
            </p>
            <p>Ви можете увійти в особистий кабінет за посиланням:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login">Увійти в кабінет</a>

            <p style="font-size: 16px; line-height: 1.6;">
              З теплом,<br />
              <strong>Пані Юля</strong> 🌼
            </p>

          </div>

          <p style="text-align: center; font-size: 12px; color: #9ca3af; margin-top: 16px;">
            © Pani Yulya
          </p>
        </div>`

    const { error: errorUser } = await resend.emails.send({
      from: 'Pani Yulya <noreply@pani-yulya.kids>',
      to: [email],
      subject,
      html: htmlContent,
    })

    if (errorUser) {
      return { success: false, message: errorUser.message }
    }

    return { success: true, message: 'Замовлення відправлено!' }
  } catch (error) {
    console.log(error)
    return { success: false, message: 'Помилка при відправці' }
  }
}

export async function generateWayForPaySignature(params: {
  merchantAccount: string
  merchantDomainName: string
  orderReference: string
  orderDate: number
  amount: number
  currency: string
  productName: string[]
  productCount: number[]
  productPrice: number[]
}) {
  const dataToSign = [
    params.merchantAccount,
    params.merchantDomainName,
    params.orderReference,
    params.orderDate,
    params.amount,
    params.currency,
    params.productName.join(';'),
    params.productCount.join(';'),
    params.productPrice.join(';'),
  ].join(';')

  let secretKey = process.env.WAYFORPAY_SECRET_KEY || ''
  if (!secretKey && params.merchantAccount === 'test_merch_n1') {
    secretKey = 'flk3409refn54t54t*FNJRET'
  }
  return crypto.createHmac('md5', secretKey).update(dataToSign).digest('hex')
}

export async function createWayForPayInvoice(params: {
  merchantDomainName: string
  orderReference: string
  orderDate: number
  amount: number
  productName: string[]
  productCount: number[]
  productPrice: number[]
}) {
  const merchantAccount = process.env.NEXT_PUBLIC_WAYFORPAY_MERCHANT || 'test_merch_n1'

  const sanitizedProductNames = params.productName.map(n => n.replace(/;/g, ' '))

  const signature = await generateWayForPaySignature({
    merchantAccount,
    merchantDomainName: params.merchantDomainName,
    orderReference: params.orderReference,
    orderDate: params.orderDate,
    amount: params.amount,
    currency: 'UAH',
    productName: sanitizedProductNames,
    productCount: params.productCount,
    productPrice: params.productPrice,
  })

  const body = {
    transactionType: 'CREATE_INVOICE',
    merchantAccount,
    merchantAuthType: 'SimpleSignature',
    merchantDomainName: params.merchantDomainName,
    merchantSignature: signature,
    apiVersion: 1,
    merchantTransactionSecureType: 'AUTO',
    orderReference: params.orderReference,
    orderDate: params.orderDate,
    amount: Number(params.amount.toFixed(2)),
    currency: 'UAH',
    productName: sanitizedProductNames,
    productPrice: params.productPrice,
    productCount: params.productCount,
    serviceUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://pani-yulya.kids'}/api/wayforpay/webhook`,
    approvedUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://pani-yulya.kids'}/checkout/success`,
    declinedUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://pani-yulya.kids'}/checkout/failed`,
  }

  try {
    const response = await fetch('https://api.wayforpay.com/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const result = await response.json()
console.log('WayForPay create invoice response:', result)
    if (result.reasonCode === 1100 && result.invoiceUrl) {
      return { success: true, url: result.invoiceUrl }
    }

    return { success: false, message: result.reason || 'Помилка створення інвойсу' }
  } catch (error) {
    console.error('WayForPay API Error:', error)
    return { success: false, message: 'Помилка з\'єднання з платіжною системою' }
  }
}

export async function saveOrderToDb(order: OrderType) {
  try {
    await dbConnect()

    const email = order.contacts.email

    await Order.create({
      ...order,
      status: 'pending',
      userEmail: email,
    })

    return { success: true }
  } catch (error) {
    console.error("DB Error:", error)
    return { success: false }
  }
}

export async function getPurchasedTrackIds() {
  try {
    await dbConnect()

    let userEmail: string | undefined
    const session = await getSession()

    if (session?.email) {
      userEmail = session.email
    } else {
      const cookieStore = await cookies()
      userEmail = cookieStore.get('user_email')?.value
    }

    if (!userEmail) return []

    const user = await User.findOne({ email: userEmail }).populate('orders').lean()

    if (!user || !user.orders) return []

    const trackIds = new Set<string>()

    user.orders.forEach((order: OrderType) => {
      if (order.productType === 'music_track' && order.status === 'paid' && order.productData?.trackIds) {
        order.productData.trackIds.forEach((id: string) => trackIds.add(id))
      }
    })

    return Array.from(trackIds)
  } catch (error) {
    console.error("DB Error:", error)
    return []
  }
}