import Brand from "./Brand";

export default function FooterLanding() {
  return (
    <footer className="mt-20 w-full backdrop-blur-xl bg-white/10 border-t border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-10 text-center">

        {/* Brand */}
        <div className="flex justify-center mb-3">
          <Brand light size="lg" />
        </div>

        {/* Tagline */}
        <p className="text-green-100 text-sm mb-4">
          Smart travel budgeting for stress-free journeys
        </p>

        {/* Divider */}
        <div className="w-24 h-[2px] bg-green-300 mx-auto mb-4 rounded-full" />

        {/* Copyright */}
        <p className="text-green-100/80 text-xs">
          © {new Date().getFullYear()} TraveLeo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
