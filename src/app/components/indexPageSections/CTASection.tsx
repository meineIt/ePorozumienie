interface CTASectionProps {
  onCTAClick: () => void;
}

export default function CTASection({ onCTAClick }: CTASectionProps) {
  return (
    <section className="py-16 element-with-pattern">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">
          Zainwestuj w przyszłość mediacji online
        </h2>
        <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
          e-Porozumienie to <strong>innowacyjne rozwiązanie</strong> z potencjałem transformacji
          rynku mediacji w Polsce i Europie. Nasza strategia rozwoju zakłada:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">6 miesięcy</h3>
            <p className="text-blue-100">
              <strong>MVP</strong>, pilotaż, 50 mediacji, partnerstwa z 3 bankami i 5 kancelariami
            </p>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">12 miesięcy</h3>
            <p className="text-blue-100">
              <strong>Komercjalizacja</strong>, 200 mediacji/mies., pierwsze płatne wdrożenia B2B
            </p>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">24 miesiące</h3>
            <p className="text-blue-100">
              <strong>2000+ mediacji/mies.</strong>, ekspansja na rynki zagraniczne (CEE, UE)
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={onCTAClick}
            className="bg-white text-blue-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 animate-pulse"
          >
            Odbierz zniżkę
          </button>
        </div>
      </div>
    </section>
  );
}

