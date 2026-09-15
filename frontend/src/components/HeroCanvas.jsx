// components/HeroCanvas.jsx
// Decorative canvas animation from the new design's dashboard hero:
// points drift out of noise and settle into a small network structure,
// nudged by the cursor. Purely visual, no data dependency.
import { useEffect, useRef } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const W = cv.width;
    const H = cv.height;
    const pts = [];
    const hubs = [];
    const layers = [5, 9, 11, 7, 4];
    const cx = W / 2;
    const cy = H / 2;
    const spanX = W * 0.64;
    const spanY = H * 0.58;

    layers.forEach((n, li) => {
      const x = cx - spanX / 2 + (spanX * li) / (layers.length - 1);
      for (let i = 0; i < n; i++) {
        hubs.push({ x, y: cy - spanY / 2 + (spanY * (i + 0.5)) / n, li });
      }
    });

    const N = Math.round((W * H) / 420);
    for (let i = 0; i < N; i++) {
      const h = hubs[Math.floor(Math.random() * hubs.length)];
      const a = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.6) * 34;
      pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        tx: h.x + Math.cos(a) * r,
        ty: h.y + Math.sin(a) * r,
        vx: 0,
        vy: 0,
        s: Math.random() < 0.12 ? 2.4 : 1.4,
        red: Math.random() < 0.09,
      });
    }

    let mx = -9999;
    let my = -9999;
    let t = 0;
    let raf;
    let running = true;

    const onMouseMove = (e) => {
      const b = cv.getBoundingClientRect();
      mx = (e.clientX - b.left) * (W / b.width);
      my = (e.clientY - b.top) * (H / b.height);
    };
    const onMouseLeave = () => {
      mx = -9999;
      my = -9999;
    };
    cv.addEventListener("mousemove", onMouseMove);
    cv.addEventListener("mouseleave", onMouseLeave);

    const tick = () => {
      if (!running) return;
      t += 0.006;
      ctx.fillStyle = "#0b1730";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(90,130,200,0.15)";
      ctx.lineWidth = 1;
      for (let a = 0; a < hubs.length; a++) {
        for (let b = a + 1; b < hubs.length; b++) {
          if (hubs[b].li !== hubs[a].li + 1 || (a * 7 + b * 13) % 3) continue;
          ctx.beginPath();
          ctx.moveTo(hubs[a].x, hubs[a].y);
          ctx.lineTo(hubs[b].x, hubs[b].y);
          ctx.stroke();
        }
      }
      for (const p of pts) {
        const wob = Math.sin(t * 2 + p.tx * 0.01) * 7;
        p.vx += (p.tx - p.x) * 0.008;
        p.vy += (p.ty + wob - p.y) * 0.008;
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 26000) {
          const f = ((26000 - d2) / 26000) * 1.3;
          p.vx += dx * f * 0.02;
          p.vy += dy * f * 0.02;
        }
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.red ? "rgba(221,43,15,0.95)" : "rgba(190,208,235,0.75)";
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      cv.removeEventListener("mousemove", onMouseMove);
      cv.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={620}
      height={470}
      className="absolute inset-0 w-full h-full block"
    />
  );
}
