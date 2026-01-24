'use server'

import { Resend } from 'resend';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { login, logout } from '@/lib/auth';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function requestLoginCode(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { success: false, message: 'Невірний email' };
  }

  await dbConnect();

  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await User.findOneAndUpdate(
    { email },
    { 
      email, 
      verificationCode: code, 
      verificationCodeExpires: expires 
    },
    { upsert: true, new: true }
  );

  try {
    await resend.emails.send({
      from: 'Pani Yulya <noreply@pani-yulya.kids>',
      to: email,
      subject: 'Ваш код входу',
      html: `<p>Ваш код для входу: <strong>${code}</strong></p>`,
    });
    return { success: true, message: 'Код надіслано!', step: 'verify', email };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Помилка відправки email' };
  }
}

export async function verifyLoginCode(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const code = formData.get('code') as string;

  await dbConnect();
  const user = await User.findOne({ email });

  if (!user) {
    return { success: false, message: 'Користувача не знайдено' };
  }

  if (user.verificationCode !== code || user.verificationCodeExpires < new Date()) {
    return { success: false, message: 'Невірний або прострочений код' };
  }

  // Clear code
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  await login(email);

  return { success: true, message: 'Успішний вхід!' };
}

export async function signOut() {
  await logout();
}