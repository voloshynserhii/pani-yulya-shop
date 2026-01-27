'use client'

import { useFormStatus } from 'react-dom'
import { useActionState, useEffect, useState } from 'react'
import { requestLoginCode, verifyLoginCode } from '@/app/account/actions'
import { Button, Input, Label } from '@/components/ui'

const initialState = { success: false, message: '', step: 'email', email: '' }

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Зачекайте...' : text}
    </Button>
  )
}

export default function LoginForm() {
  const [state, formAction] = useActionState(requestLoginCode, initialState)
  const [verifyState, verifyAction] = useActionState(verifyLoginCode, { success: false, message: '' })
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (state.step === 'verify') {
      setStep('verify')
      setEmail(state.email || '')
    }
  }, [state])

  if (step === 'email') {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
        <h2 className="text-2xl font-bold mb-6 text-center">Вхід в особистий кабінет</h2>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="your@email.com" required />
          </div>
          <SubmitButton text="Отримати код" />
          {state.message && !state.success && <p className="text-red-500 text-sm text-center">{state.message}</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
      <h2 className="text-2xl font-bold mb-6 text-center">Введіть код</h2>
      <p className="text-center text-muted-foreground mb-6">Ми відправили код на {email}</p>
      <form action={verifyAction} className="space-y-4">
        <input type="hidden" name="email" value={email} />
        <div className="space-y-2">
          <Label htmlFor="code">Код підтвердження</Label>
          <Input id="code" name="code" type="text" placeholder="1234" required maxLength={4} className="text-center text-lg tracking-widest" />
        </div>
        <SubmitButton text="Увійти" />
        {verifyState.message && <p className={`text-sm text-center ${verifyState.success ? 'text-green-600' : 'text-red-500'}`}>{verifyState.message}</p>}
        <button type="button" onClick={() => setStep('email')} className="w-full text-sm text-muted-foreground hover:underline">
          Змінити email
        </button>
      </form>
    </div>
  )
}