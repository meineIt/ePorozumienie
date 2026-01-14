export default function AuthSidebar() {
  return (
    <div className="login-image">
      <div className="login-image-content">
        <div className="logo text-5xl md:text-6xl font-bold mb-6">e-<span className="font-normal">Porozumienie</span></div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Inteligentna platforma mediacyjna</h2>
        <p className="text-lg md:text-xl leading-relaxed mb-8 opacity-95">Rozwiązuj spory szybciej, taniej i skuteczniej dzięki wsparciu sztucznej inteligencji.</p>
        
        <div className="login-stats grid grid-cols-3 gap-4">
          <div className="stat-item bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="stat-number text-4xl md:text-5xl font-bold mb-2">4×</div>
            <div className="stat-label text-sm md:text-base">szybciej niż sąd</div>
          </div>
          <div className="stat-item bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="stat-number text-4xl md:text-5xl font-bold mb-2">10×</div>
            <div className="stat-label text-sm md:text-base">taniej niż sąd</div>
          </div>
          <div className="stat-item bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="stat-number text-4xl md:text-5xl font-bold mb-2">24/7</div>
            <div className="stat-label text-sm md:text-base">dostępność</div>
          </div>
        </div>
      </div>
    </div>
  );
}

