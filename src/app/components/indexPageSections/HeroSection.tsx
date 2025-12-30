interface HeroSectionProps {
  onCTAClick: () => void;
}

export default function HeroSection({ onCTAClick }: HeroSectionProps) {
  return (
    <header className="pt-28 pb-20 element-with-pattern">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="w-full text-center text-white mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Ugoda w 3 kliknięcia</h1>
          <p className="text-xl mb-8">
            Pierwsza platforma do <strong>mediacji online</strong>, która wykorzystując AI
            <br />
            rozwiązuje spory frankowe w <strong>3 dni</strong> zamiast w 15 miesięcy!
          </p>
          <div>
            <button
              onClick={onCTAClick}
              className="bg-white text-blue-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 animate-pulse"
            >
              Odbierz zniżkę
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

