import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="py-12" style={{ backgroundColor: "var(--secondary)" }}>
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start">
        {/* Ліва частина */}
        <div className="mb-4 md:mb-0">
          <p className="text-sm">&copy; {new Date().getFullYear()} Pani Yulya. All rights reserved.</p>
        </div>

        {/* Права частина - посилання */}
        <div className="flex flex-col space-x-6">
          <Link
            href="/about"
            className="hover:text-white transition-colors duration-200"
          >
            Про мене
          </Link>
          <Link
            href="/contact"
            className="hover:text-white transition-colors duration-200"
          >
            Контакти
          </Link>
          <Link
            href="/terms"
            className="hover:text-white transition-colors duration-200"
          >
            Умови використання
          </Link>
          <Link
            href="/refund-policy"
            className="hover:text-white transition-colors duration-200"
          >
            Повернення коштів
          </Link>
        </div>

        {/* Соцмережі */}
        <div className="flex flex-col space-x-4 mt-4 md:mt-0">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
