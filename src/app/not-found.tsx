import Link from "next/link";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pt-16">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4" style={{ color: "var(--foreground)" }}>404</h1>
        <h2 className="text-3xl font-semibold text-(--foreground) mb-6">
          Сторінка не знайдена
        </h2>
        <p className="text-(--foreground) text-lg mb-8 max-w-md">
          На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Повернутися на головну
        </Link>
      </div>
    </div>
    </>
  );
}
