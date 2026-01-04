export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Kontakt</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-blue-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <a
                  href="mailto:eporozumienie@protonmail.com"
                  className="text-gray-600 hover:text-blue-700 transition duration-300"
                >
                  eporozumienie@protonmail.com
                </a>
              </div>
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-600 mr-3 mt-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <div className="text-gray-600">
                  <p>ul. Rynek 1</p>
                  <p>48-081 Katowice</p>
                  <p>Polska</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">O nas</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#jak-to-dziala"
                  className="text-gray-600 hover:text-blue-700 transition duration-300"
                >
                  Jak to działa
                </a>
              </li>
              <li>
                <a
                  href="#korzysci"
                  className="text-gray-600 hover:text-blue-700 transition duration-300"
                >
                  Korzyści
                </a>
              </li>
              <li>
                <a
                  href="#kredyty-frankowe"
                  className="text-gray-600 hover:text-blue-700 transition duration-300"
                >
                  Kredyty frankowe
                </a>
              </li>
              <li>
                <a
                  href="#cennik"
                  className="text-gray-600 hover:text-blue-700 transition duration-300"
                >
                  Model biznesowy
                </a>
              </li>
              <li>
                <a
                  href="#zespol"
                  className="text-gray-600 hover:text-blue-700 transition duration-300"
                >
                  Zespół
                </a>
              </li>
            </ul>
          </div>

          {/* LinkedIn Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Znajdź nas na LinkedIn</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.linkedin.com/in/simonebarszczak/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-700 transition duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>Simone Barszczak</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/urzenitzok/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-700 transition duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>Paweł Urzenitzok</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/mikolaj-uroda/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-700 transition duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>Mikołaj Uroda</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500">&copy; 2026 e-Porozumienie. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}

