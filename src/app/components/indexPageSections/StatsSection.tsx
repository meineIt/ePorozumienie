export default function StatsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg text-center card-hover transition-all duration-300">
            <h3 className="text-4xl font-bold text-blue-800 mb-2">18 mln+</h3>
            <p className="text-gray-700">spraw sądowych rocznie w Polsce</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg text-center card-hover transition-all duration-300">
            <h3 className="text-4xl font-bold text-blue-800 mb-2">72h</h3>
            <p className="text-gray-700">zamiast 72 tygodni oczekiwania</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg text-center card-hover transition-all duration-300">
            <h3 className="text-4xl font-bold text-blue-800 mb-2">90 000+</h3>
            <p className="text-gray-700">nowych pozwów frankowych w 2024</p>
          </div>
        </div>
      </div>
    </section>
  );
}

