"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { createWayForPayInvoice } from "@/app/actions";
import { saveOrderToDb } from "@/app/actions";
import type { FormData } from '@/types'

export default function VideoGreetingForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData & { image1: FileList; image2: FileList; image3: FileList }>({
    defaultValues: {
      childName: "",
      childNameCute: "",
      age: undefined,
      birthday: "",
      telegram: "",
      email: ""
    },
  });

  const image1 = watch('image1');
  const image2 = watch('image2');
  const image3 = watch('image3');

  const onSubmit = async (data: FormData & { image1: FileList; image2: FileList; image3: FileList }) => {
    if (!data.childName || !data.age || !data.birthday || !data.email) return;

    const orderReference = `ORDER_VIDEO_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const imageUrls: string[] = [];

    const uploadImage = async (fileList: FileList) => {
      if (fileList && fileList.length > 0) {
        const file = fileList[0];
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const blob = await response.json();
          return blob.url;
        }
      }
      return null;
    };

    try {
      const url1 = await uploadImage(data.image1);
      if (url1) imageUrls.push(url1);
      const url2 = await uploadImage(data.image2);
      if (url2) imageUrls.push(url2);
      const url3 = await uploadImage(data.image3);
      if (url3) imageUrls.push(url3);
    } catch (e) {
      console.error('Failed to upload file', e)
    }

    try {
      const orderDate = Math.floor(Date.now() / 1000);
      const merchantDomainName = window.location.hostname;
      const productName = [`Відеопривітання для ${data.childName} з нагоди ${data.age} років.`];

      const result = await createWayForPayInvoice({
        merchantDomainName,
        orderReference,
        orderDate,
        amount: 1000,
        productName,
        productCount: [1],
        productPrice: [1000],
      });

      if (result.success && result.url) {
        try {
          const { telegram = '', childName, childNameCute, age, birthday } = data;
          const email = data.email.toLowerCase().trim();

          const order = {
            reference: orderReference,
            amount: 1000,
            currency: 'UAH',
            productType: 'video_greeting',
            productData: { childName, childNameCute, age, birthday, imageUrls },
            contacts: { email, telegram },
            orderDate: new Date(),
          };

          await saveOrderToDb(order);

        } catch (error) {
          console.error("DB Error:", error);
        }

        window.location.href = result.url;
      } else {
        alert(result.message || "Помилка при створенні оплати");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Сталася помилка при підготовці оплати");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-xl space-y-6 rounded-2xl border border-border bg-white p-6 shadow-sm"
      style={{ backgroundColor: "var(--accent)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Імʼя дитини"
          error={errors.childName?.message}
        >
          <Input
            placeholder="Введіть імʼя дитини"
            {...register("childName", {
              required: "Вкажіть імʼя дитини",
            })}
          />
        </Field>

        <Field
          label="Пестлива форма імені"
          error={errors.childNameCute?.message}
        >
          <Input
            placeholder="Введіть пестливу форму імені дитини"
            {...register("childNameCute", {
              required: "Вкажіть пестливу форму імені",
            })}
          />
        </Field>

        <Field
          label="Скільки років виповнюється"
          error={errors.age?.message}
        >
          <Input
            type="number"
            placeholder="3"
            {...register("age", {
              required: "Вкажіть вік",
              min: { value: 1, message: "Вік має бути більшим за 0" },
            })}
          />
        </Field>

        <Field
          label="Дата народження"
          error={errors.birthday?.message}
        >
          <Input
            type="date"
            className="min-w-0 appearance-none"
            {...register("birthday", {
              required: "Вкажіть дату народження",
            })}
          />
        </Field>

        <Field
          label="Telegram для звʼязку"
        >
          <Input
            placeholder="@username"
            {...register("telegram")}
          />
        </Field>

        <Field
          label="Ваш email"
          error={errors.email?.message}
        >
          <Input
            placeholder="Вкажіть Ваш email"
            {...register("email", {
              required: "Email обовʼязковий",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Невірний email",
              },
            })}
          />
        </Field>

        <Field label="Фото дитини 1" error={errors.image1?.message}>
          <div className="flex items-center gap-2">
            <Input type="file" accept="image/*" {...register('image1')} />
            {image1 && image1.length > 0 && (
              <button
                type="button"
                onClick={() => setValue('image1', null as any)}
                className="p-2 text-red-500 hover:text-red-400 transition-colors"
                title="Видалити фото"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </Field>

        {image1 && image1.length > 0 && (
          <Field label="Фото дитини 2">
            <div className="flex items-center gap-2">
              <Input type="file" accept="image/*" {...register('image2')} />
              {image2 && image2.length > 0 && (
                <button
                  type="button"
                  onClick={() => setValue('image2', null as any)}
                  className="p-2 text-red-500 hover:text-red-400 transition-colors"
                  title="Видалити фото"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </Field>
        )}

        {image2 && image2.length > 0 && (
          <Field label="Фото дитини 3">
            <div className="flex items-center gap-2">
              <Input type="file" accept="image/*" {...register('image3')} />
              {image3 && image3.length > 0 && (
                <button
                  type="button"
                  onClick={() => setValue('image3', null as any)}
                  className="p-2 text-red-500 hover:text-red-400 transition-colors"
                  title="Видалити фото"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </Field>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="flex flex-col">
          <div className="text-lg font-medium">Вартість: 1000 грн</div>
          <div className="text-xs text-muted-foreground font-medium">*Подбайте про подарунок заздалегідь. Створення привітання займає до двох тижнів.</div>
        </div>

        <Button size="lg" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Надсилаємо..." : "Замовити"}
        </Button>
      </div>
    </form>
  );
}

/* =====================
   Reusable Field wrapper
   ===================== */

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      <Label>{label}</Label>
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
