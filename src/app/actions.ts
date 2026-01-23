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
    amount: params.amount,
    currency: 'UAH',
    productName: sanitizedProductNames,
    productPrice: params.productPrice,
    productCount: params.productCount,
    returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://pani-yulya.kids'}/api/checkout/return`,
  }
console.log('WayForPay POST Request Body:', body);
  try {
    const response = await fetch('https://api.wayforpay.com/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const result = await response.json()

    if (result.reasonCode === 1100 && result.invoiceUrl) {
      return { success: true, url: result.invoiceUrl }
    }
    
    return { success: false, message: result.reason || 'Помилка створення інвойсу' }
  } catch (error) {
    console.error('WayForPay API Error:', error)
    return { success: false, message: 'Помилка з\'єднання з платіжною системою' }
  }
}