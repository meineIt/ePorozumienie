import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-bold text-blue-800">e-Porozumienie</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#jak-to-dziala" className="text-gray-700 hover:text-blue-700 font-medium">
            Jak to działa
          </a>
          <a href="#korzysci" className="text-gray-700 hover:text-blue-700 font-medium">
            Korzyści
          </a>
          <a href="#kredyty-frankowe" className="text-gray-700 hover:text-blue-700 font-medium">
            Kredyty frankowe
          </a>
          <a href="#cennik" className="text-gray-700 hover:text-blue-700 font-medium">
            Model biznesowy
          </a>
          <a href="#zespol" className="text-gray-700 hover:text-blue-700 font-medium">
            Zespół
          </a>
        </div>
        <div>
          <Link
            href="/login"
            className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg font-medium transition duration-300"
          >
            Logowanie
          </Link>
        </div>
      </div>
    </nav>
  );
}

