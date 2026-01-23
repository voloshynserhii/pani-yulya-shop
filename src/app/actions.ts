'use server'

import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrder(prevState: any, formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const phone = formData.get('phone')
  const childName = formData.get('childName')
  const comment = formData.get('comment')

  try {
    const { data, error } = await resend.emails.send({
      from: 'Pani Yulya Shop <onboarding@resend.dev>',
      to: ['your-email@example.com'], // ❗ Replace with your actual email
      subject: 'Нове замовлення відеопривітання',
      html: `
        <h1>Нове замовлення!</h1>
        <p><strong>Ім'я:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Ім'я дитини:</strong> ${childName}</p>
        <p><strong>Коментар:</strong> ${comment}</p>
      `,
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true, message: 'Замовлення відправлено!' }
  } catch (error) {
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

  const secretKey = process.env.WAYFORPAY_SECRET_KEY || ''
  return crypto.createHmac('md5', secretKey).update(dataToSign).digest('hex')
}