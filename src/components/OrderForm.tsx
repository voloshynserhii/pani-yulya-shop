"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";

type FormData = {
  childName: string;
  childNameCute: string;
  age: number;
  telegram: string;
  notes?: string;
};

export default function VideoGreetingForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      childName: "",
      childNameCute: "",
      age: undefined,
      telegram: "",
      notes: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);

    // TODO: replace with API call
    await new Promise((r) => setTimeout(r, 800));

    reset();
    alert("Дякуємо! Ми звʼяжемось з вами в Telegram 💛");
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
          label="Telegram для звʼязку"
          error={errors.telegram?.message}
        >
          <Input
            placeholder="@username"
            {...register("telegram")}
          />
        </Field>
        <Field
          label="Ваш email"
          error={errors.telegram?.message}
        >
          <Input
            placeholder="Вкажіть Ваш email"
            {...register("telegram", {
              required: "Email обовʼязковий",
              pattern: {
                value: /^@?[a-zA-Z0-9_]{5,}$/,
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
