import Link from 'next/link';
import Footer from './components/indexPageSections/Footer';
import Navigation from './components/indexPageSections/Navigation';


export default function NotFound() {
  return (
    <>
    <Navigation />
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <div className="grow flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-9xl font-bold bg-linear-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
              404
            </h1>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Strona nie została znaleziona
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-8 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              Powrót do strony głównej
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
}