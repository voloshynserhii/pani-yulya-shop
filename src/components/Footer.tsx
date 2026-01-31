import Link from 'next/link'
import { Instagram, Youtube } from 'lucide-react'

const TikTok = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

const Footer = () => {
  return (
    <footer className="py-12 bg-white">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start">
        {/* Ліва частина */}
        <div className="flex gap-2 mb-4 md:mb-0">
          <p className="text-sm">&copy; {new Date().getFullYear()}</p>
          <Link
            target="_blank"
            href="https://vosquerylab.vercel.app/"
            className="text-sky-600 hover:text-sky-200 font-bold transition-colors duration-200"
          >
            <p className="text-sm">Vo$Query Lab</p>
          </Link>
          <p className="text-sm">All rights reserved.</p>
        </div>

        {/* Права частина - посилання */}
        <div className="flex flex-col space-x-6">
          <Link
            href="/about"
            className="hover:text-sky-200 transition-colors duration-200"
          >
            Про мене
          </Link>
          <Link
            href="/contact"
            className="hover:text-sky-200 transition-colors duration-200"
          >
            Контакти
          </Link>
          <Link
            href="/terms"
            className="hover:text-sky-200 transition-colors duration-200"
          >
            Умови використання
          </Link>
          <Link
            href="/refund-policy"
            className="hover:text-sky-200 transition-colors duration-200"
          >
            Повернення коштів
          </Link>
        </div>

        {/* Соцмережі */}
        <div className="flex flex-row gap-4 mt-4 md:mt-0">
          <Link
            href="https://www.tiktok.com/@pani_yulya"
            target="_blank"
            rel="noopener noreferrer"
            className=" hover:text-sky-200 transition-colors duration-200"
            aria-label="TikTok"
          >
            <TikTok className="w-6 h-6" />
          </Link>
          <Link
            href="https://www.instagram.com/yulya_kolodeeva/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-200 transition-colors duration-200"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6" />
          </Link>
          <Link
            href="https://www.youtube.com/@PaniYulya"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-200 transition-colors duration-200"
            aria-label="Youtube"
          >
            <Youtube className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
