import Link from 'next/link';
import Navigation from './components/indexPageSections/Navigation';
import Footer from './components/indexPageSections/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <div className="grow flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
              404
            </h1>
          </div>
          
          {/* Error Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Strona nie została znaleziona
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Przepraszamy, ale strona, której szukasz, nie istnieje lub została przeniesiona.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-8 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              Powrót do strony głównej
            </Link>
            
            <Link
              href="/login"
              className="bg-white hover:bg-gray-50 text-blue-700 border-2 border-blue-700 py-3 px-8 rounded-lg font-medium transition duration-300"
            >
              Zaloguj się
            </Link>
          </div>
          
          {/* Decorative Elements */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
            </div>
            <div className="relative">
              <svg
                className="w-32 h-32 mx-auto text-blue-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}