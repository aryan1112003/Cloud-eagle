import ChatInterface from "./components/ChatInterface";

export default function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">

      {/* Animated background */}
      <div className="bg-scene">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>
      <div className="bg-grid" />

      {/* Main layout */}
      <div className="relative z-10 flex flex-col h-full max-w-3xl mx-auto px-4 py-4">

        {/* Header */}
        <header className="glass rounded-2xl px-6 py-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="pulse-ring" />
              <div className="w-11 h-11 rounded-xl avatar-ai flex items-center justify-center text-xl">
                <span className="globe-float">🌍</span>
              </div>
            </div>
            <div>
              <h1 className="text-base font-semibold text-white tracking-tight">
                GeoMind
              </h1>
              <p className="text-xs text-slate-400 font-light">Country Intelligence · Powered by AI</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="brand-chip px-3 py-1.5 rounded-full text-slate-300 font-medium">
              Built by <span className="text-indigo-400 font-semibold">Aryan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              <span className="text-xs text-slate-400">Live</span>
            </div>
          </div>
        </header>

        {/* Chat */}
        <div className="flex-1 min-h-0">
          <ChatInterface />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-3 font-light tracking-wide">
          Data from <span className="text-slate-500">restcountries.com</span> · Ask about any country in the world
        </p>
      </div>
    </div>
  );
}
