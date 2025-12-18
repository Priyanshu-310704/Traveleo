import Brand from "./Brand";

export default function FooterLanding() {
  return (
    <footer
      className="
        w-full
        bg-gradient-to-br 
        from-[#0E1628] via-[#0A2F2C] to-[#053A2E]
        border-t border-white/10
        backdrop-blur-xl
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col items-center text-center gap-5">

          {/* BRAND */}
          <div className="opacity-95">
            <Brand light size="lg" />
          </div>

          {/* TAGLINE */}
          <p className="text-sm text-white/60 max-w-md leading-relaxed">
            Smarter travel budgeting and expense tracking for stress-free
            journeys.
          </p>

          {/* SUBTLE ACCENT LINE */}
          <div
            className="
              w-28 h-[2px] rounded-full
              bg-gradient-to-r 
              from-transparent 
              via-emerald-400/70 
              to-transparent
            "
          />

          {/* COPYRIGHT */}
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} TraveLeo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
