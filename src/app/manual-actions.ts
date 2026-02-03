'use server'

import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { sendEmails } from '@/app/actions'

export async function manualSendEmails(orderId: string) {
  try {
    await dbConnect()
    const order = await Order.findById(orderId).lean()

    if (!order) {
      return { success: false, error: 'Order not found' }
    }

    await sendEmails(order)
    console.log('Emails sent manually and successfully!')
    return { success: true, message: 'Emails sent' }
  } catch (error) {
    console.error('Manual send emails error:', error)
    return { success: false, error: 'Failed to send emails' }
  }
}