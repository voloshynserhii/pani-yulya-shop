"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { createWayForPayInvoice } from "@/app/actions";
import { sendOrder } from "@/app/actions";

type FormData = {
  childName: string;
  childNameCute: string;
  age: number;
  birthday: string;
  telegram: string;
  email: string;
  notes?: string;
};

export default function VideoGreetingForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      childName: "",
      childNameCute: "",
      age: undefined,
      birthday: "",
      telegram: "",
      email: ""
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const orderReference = `ORDER_VIDEO_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const orderDate = Math.floor(Date.now() / 1000);
      const merchantDomainName = window.location.hostname;

      const result = await createWayForPayInvoice({
        merchantDomainName,
        orderReference,
        orderDate,
        amount: 1000,
        productName: [`Відеопривітання для ${data.childName} з нагоди ${data.age} років.`],
        productCount: [1],
        productPrice: [1000],
      });

      if (result.success && result.url) {
        await sendOrder(data);
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
      </div>

      {/* Notes */}
      {/*       <Field label="Побажання або важливі деталі">
        <Textarea
          placeholder="Напишіть, якщо є особливі побажання"
          {...register("notes")}
        />
      </Field> */}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="text-lg font-medium">Вартість: 1000 грн</div>
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
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
