import Image from 'next/image';

export default function TeamSection() {
  return (
    <section id="zespol" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Founderzy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center">
            <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full bg-gray-200">
              <Image
                src="/images/1.jpg"
                alt="Simone Barszczak"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-1 text-gray-800">Simone Barszczak</h3>
            <p className="text-blue-700 font-medium mb-3">Prawnik nowych technologii</p>
            <p className="text-gray-600">
              Prawnik Nowych Technologii specjalizujący się w <strong>FinTech, Cyberbezpieczeństwie</strong> i Legal Design
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center">
            <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full bg-gray-200">
              <Image
                src="/images/2.jpg"
                alt="Paweł Urzenitzok"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-1 text-gray-800">Paweł Urzenitzok</h3>
            <p className="text-blue-700 font-medium mb-3">Doktorant</p>
            <p className="text-gray-600">
              Doktorant <strong>prawa nowych technologii</strong> badający legaltech.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center">
            <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full bg-gray-200">
              <Image
                src="/images/3.jpg"
                alt="Mikołaj Uroda"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-1 text-gray-800">Mikołaj Uroda</h3>
            <p className="text-blue-700 font-medium mb-3">Prawnik, informatyk</p>
            <p className="text-gray-600">
              Specjalista łączący wiedzę prawniczą z umiejętnościami <strong>programistycznymi</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

