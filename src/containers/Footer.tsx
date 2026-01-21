const Footer = () => {
  return (
    <footer className="py-12" style={{ backgroundColor: "var(--secondary)" }}>
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Ліва частина */}
        <div className="mb-4 md:mb-0">
          <p className="text-sm">&copy; {new Date().getFullYear()} Pani Yulya. All rights reserved.</p>
        </div>

        {/* Права частина - посилання */}
        <div className="flex space-x-6">
          <a
            href="/about"
            className="hover:text-white transition-colors duration-200"
          >
            About
          </a>
          <a
            href="/contact"
            className="hover:text-white transition-colors duration-200"
          >
            Contact
          </a>
          <a
            href="/privacy"
            className="hover:text-white transition-colors duration-200"
          >
            Privacy
          </a>
        </div>

        {/* Соцмережі */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
          >
            Twitter
          </a>
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
