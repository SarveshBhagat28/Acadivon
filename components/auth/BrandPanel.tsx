import { Logo } from "@/components/Logo";
import { brandConfig } from "@/lib/branding";

/**
 * BrandPanel — left half of the split-screen login.
 * Black-to-dark-blue gradient with subtle low-opacity mathematical patterns,
 * the Acadivon logo, and the brand tagline.
 */
export default function BrandPanel() {
  return (
    <div
      className="relative hidden lg:flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #000000 0%, #0a0a1a 30%, #0d1b4b 65%, #0b2a6b 100%)",
      }}
    >
      {/* ── Decorative mathematical / geometric SVG patterns ── */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.07] select-none pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#dots)" />

        {/* Trigonometric curve */}
        <path
          d="M -10 300 Q 80 200 160 300 Q 240 400 320 300 Q 400 200 480 300 Q 560 400 640 300 Q 720 200 800 300"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        />
        <path
          d="M -10 420 Q 80 320 160 420 Q 240 520 320 420 Q 400 320 480 420 Q 560 520 640 420 Q 720 320 800 420"
          fill="none"
          stroke="white"
          strokeWidth="1"
        />

        {/* Geometric shapes */}
        <polygon points="100,80 140,160 60,160" fill="none" stroke="white" strokeWidth="1" />
        <circle cx="520" cy="130" r="55" fill="none" stroke="white" strokeWidth="1" />
        <rect x="380" y="480" width="80" height="80" fill="none" stroke="white" strokeWidth="1" transform="rotate(15 420 520)" />

        {/* Mathematical equations as text */}
        <text x="60" y="260" fill="white" fontSize="13" fontFamily="monospace" opacity="0.9">E = mc²</text>
        <text x="420" y="220" fill="white" fontSize="11" fontFamily="monospace" opacity="0.9">∫₀^∞ e⁻ˣ dx = 1</text>
        <text x="200" y="520" fill="white" fontSize="12" fontFamily="monospace" opacity="0.9">∑ n² = n(n+1)(2n+1)/6</text>
        <text x="500" y="560" fill="white" fontSize="11" fontFamily="monospace" opacity="0.9">a² + b² = c²</text>
        <text x="70" y="480" fill="white" fontSize="11" fontFamily="monospace" opacity="0.9">F = ma</text>
        <text x="330" y="90" fill="white" fontSize="12" fontFamily="monospace" opacity="0.9">lim x→0 sin(x)/x = 1</text>

        {/* Axis arrows */}
        <line x1="60" y1="360" x2="200" y2="360" stroke="white" strokeWidth="1" markerEnd="url(#arrow)" />
        <line x1="60" y1="360" x2="60" y2="220" stroke="white" strokeWidth="1" markerEnd="url(#arrow)" />
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="white" />
          </marker>
        </defs>
        {/* Sample data points on axis */}
        <circle cx="100" cy="340" r="3" fill="white" />
        <circle cx="130" cy="310" r="3" fill="white" />
        <circle cx="160" cy="290" r="3" fill="white" />
        <circle cx="190" cy="270" r="3" fill="white" />

        {/* Parabola y = x² */}
        <path
          d="M 380 560 Q 430 430 480 560"
          fill="none"
          stroke="white"
          strokeWidth="1.2"
        />
      </svg>

      {/* ── Radial glow overlay for depth ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.12) 0%, transparent 70%)",
        }}
      />

      {/* ── Brand content ── */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-12 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center rounded-2xl bg-white/10 p-5 shadow-2xl ring-1 ring-white/20 backdrop-blur-sm">
          <Logo
            size="xl"
            variant="white"
            alt={`${brandConfig.name} authentication logo`}
            className="drop-shadow-xl"
            priority
          />
        </div>

        {/* Brand name */}
        <div className="space-y-3">
          <h1 className="text-5xl font-extrabold tracking-widest text-white drop-shadow-lg">
            ACADIVON
          </h1>
          <p className="text-lg font-light tracking-[0.2em] text-blue-200/80">
            Manage Study Excellence
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 max-w-xs mt-2">
          {["AI Tutoring", "Smart Timetable", "Attendance", "Study Plans"].map((feat) => (
            <span
              key={feat}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-sm"
            >
              {feat}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bottom fade ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
        }}
      />
    </div>
  );
}
