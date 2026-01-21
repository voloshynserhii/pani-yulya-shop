import * as React from "react";


export function Card({ className = "", ...props }) {
    return (
        <div
            className={`bg-white border border-border rounded-2xl ${className}`}
            {...props}
        />
    );
}


export function CardContent({ className = "", ...props }) {
    return <div className={`p-6 ${className}`} {...props} />;
}

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  backgroundColor?: string;
}

export function Button({
  className = "",
  size = "md",
  backgroundColor = "var(--foreground)",
  ...props
}: ButtonProps) {
  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      style={{ backgroundColor }}
      className={`inline-flex items-center justify-center font-medium rounded-xl bg-black text-white hover:opacity-90 transition ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

export function Input({ className = "", ...props }) {
    return (
        <input
            className={`w-full rounded-xl border border-border px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-black ${className}`}
            {...props}
        />
    );
}


export function Textarea({ className = "", ...props }) {
    return (
        <textarea
            className={`w-full min-h-[100px] rounded-xl border border-border px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-black ${className}`}
            {...props}
        />
    );
}


export function Label({ className = "", ...props }) {
    return (
        <label
            className={`text-sm font-medium text-muted-foreground ${className}`}
            {...props}
        />
    );
}