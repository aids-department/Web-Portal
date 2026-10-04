// components/ui/AmbientBackground.jsx
// The layered "deep space" canvas that sits behind every page:
// base radial gradient → noise → floating light blobs → 64px grid.
// Fixed and pointer-events-none so it never interferes with content.

export default function AmbientBackground({ intensity = 1 }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Layer 1 — base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a0a0f_0%,#050506_50%,#020203_100%)]" />

      {/* Layer 3 — ambient light pools */}
      <div style={{ opacity: intensity }} className="absolute inset-0">
        {/* outer div positions, inner div floats (the float keyframes own `transform`) */}
        <div className="absolute left-1/2 top-[-56rem] -translate-x-1/2">
          <div className="h-[1400px] w-[900px] rounded-full bg-accent/25 blur-[150px] animate-float" />
        </div>
        <div className="absolute -left-60 top-[20%] h-[800px] w-[600px] rounded-full bg-gradient-to-br from-purple-600/15 to-pink-500/10 blur-[120px] animate-float-slow" />
        <div className="absolute -right-52 top-[35%] h-[700px] w-[500px] rounded-full bg-gradient-to-bl from-indigo-500/[0.12] to-blue-500/10 blur-[100px] animate-float [animation-delay:-4s]" />
        <div className="absolute bottom-[-20rem] left-1/3 h-[600px] w-[900px] rounded-full bg-accent/10 blur-[140px] animate-pulse-glow" />
      </div>

      {/* Layer 4 — technical grid, fading out toward the bottom */}
      <div className="absolute inset-0 bg-grid opacity-[0.02] [mask-image:radial-gradient(ellipse_at_top,#000_20%,transparent_75%)]" />

      {/* Layer 2 — noise (on top so it textures the light) */}
      <div className="absolute inset-0 bg-noise opacity-[0.015] mix-blend-overlay" />
    </div>
  );
}
