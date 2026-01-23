'use server'

import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

interface FormDataParams {
  childName: string
  childNameCute: string
  age: number
  birthday: string
  telegram: string
  email: string
  notes?: string
}

export async function sendOrder(formData: FormDataParams) {
  const { childName, childNameCute, age, birthday, telegram, email} = formData

  try {
    const { error } = await resend.emails.send({
      from: 'Pani Yulya <noreply@pani-yulya.kids>',
      to: ['kolodyulya@gmail.com'],
      subject: 'Нове замовлення відеопривітання',
      html: `
        <h1>Нове замовлення!</h1>
        <p><strong>Ім'я дитини:</strong> ${childName}</p>
        <p><strong>Пестлива форма імені:</strong> ${childNameCute}</p>
        <p><strong>Вік:</strong> ${age}</p>
        <p><strong>Дата народження:</strong> ${birthday}</p>
        <p><strong>Telegram:</strong> ${telegram}</p>
        <p><strong>Email:</strong> ${email}</p>
      `,
    })

    if (error) {
      return { success: false, message: error.message }
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
    amount: params.amount,
    currency: 'UAH',
    productName: sanitizedProductNames,
    productPrice: params.productPrice,
    productCount: params.productCount,
    returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://pani-yulya.kids'}/api/checkout/return`,
  }

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