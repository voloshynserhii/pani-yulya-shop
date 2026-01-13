"use client"

import React from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  name: string
  email: string
  message: string
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: { name: '', email: '', message: '' },
  })

  const onSubmit = async (data: FormData) => {
    // Replace with API call as needed
    console.log('Form submitted', data)
    alert('Thanks! Message sent.')
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800"
    >
      <h2 className="mb-4 text-lg font-semibold">Contact Us</h2>

      <label className="mb-2 block">
        <span className="text-sm">Name</span>
        <input
          {...register('name', { required: 'Name is required' })}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none"
          placeholder="Your name"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </label>

      <label className="mb-2 block">
        <span className="text-sm">Email</span>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
          })}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </label>

      <label className="mb-4 block">
        <span className="text-sm">Message</span>
        <textarea
          {...register('message', { required: 'Message is required' })}
          rows={5}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none"
          placeholder="How can we help?"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
        )}
      </label>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-rose-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  )
}
