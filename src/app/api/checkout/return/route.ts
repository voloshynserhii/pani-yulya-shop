import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const status = formData.get('transactionStatus')
  const reasonCode = formData.get('reasonCode')

  console.log('Return URL called with status:', status, 'and reasonCode:', reasonCode, formData)

  if (status === 'Approved') {
    return NextResponse.redirect(new URL('/checkout?status=success', req.url), 303)
  } else if (status === 'Pending') {
    return NextResponse.redirect(new URL('/checkout?status=pending', req.url), 303)
  }

  return NextResponse.redirect(new URL(`/checkout?status=error&reason=${reasonCode}`, req.url), 303)
}