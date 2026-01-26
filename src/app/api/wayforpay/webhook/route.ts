import crypto from 'crypto'
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User'
import { sendEmails } from '@/app/actions'

const WAYFORPAY_SECRET = process.env.WAYFORPAY_SECRET_KEY!

function generateSignature(data: any) {
  const signatureFields = [
    data.merchantAccount,
    data.orderReference,
    String(data.amount),
    data.currency,
    data.authCode,
    data.cardPan,
    data.transactionStatus,
    data.reasonCode,
  ]

  const signatureString = signatureFields.join(';')

  return crypto
    .createHmac('md5', WAYFORPAY_SECRET)
    .update(signatureString)
    .digest('hex')
}

export async function POST(req: Request) {
  try {
    await dbConnect()

    const body = await req.json()
    console.log('WayForPay webhook received:', body)

    // 🔐 Signature validation
    const expectedSignature = generateSignature(body)

    if (body.merchantSignature !== expectedSignature) {
      console.error('WayForPay invalid signature', body)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // 🔁 Idempotency protection (important)
    const existingOrder = await Order.findOne({ reference: body.orderReference }).lean()

    if (!existingOrder) {
      console.error('Order not found:', body.orderReference)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const user = await User.findOne({ email: existingOrder.userEmail })

    if (!user) {
      console.error('User not found:', existingOrder.userEmail)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // If already paid — accept silently (WayForPay retries)
    if (existingOrder.status === 'paid') {
      return NextResponse.json({
        orderReference: body.orderReference,
        status: 'accept',
        time: Math.floor(Date.now() / 1000),
      })
    }

    // 💳 Process transaction
    if (body.transactionStatus === 'Approved') {
      await sendEmails(existingOrder.toObject())
      
      await Order.updateOne(
        { reference: body.orderReference },
        {
          $set: {
            status: 'paid',
            paidAt: new Date(),
            transactionId: body.authCode || body.transactionId,
          },
        }
      )

      user.orders.push(existingOrder._id)
      await user.save()
    } 
    
    if (body.transactionStatus === 'Declined' || body.transactionStatus === 'Expired') {
      await Order.updateOne(
        { reference: body.orderReference },
        {
          $set: {
            status: 'failed',
          },
        }
      )
    }

    // ✅ Mandatory WayForPay response
    return NextResponse.json({
      orderReference: body.orderReference,
      status: 'accept',
      time: Math.floor(Date.now() / 1000),
    })
  } catch (error) {
    console.error('WayForPay webhook error:', error)

    // 🚨 Return 500 so WayForPay retries
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
