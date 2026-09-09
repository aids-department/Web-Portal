import { useEffect, useRef } from "react";

// Particle-field animation from the department's Claude Design mockup —
// points settle from noise into a layered node graph, nudged by the cursor.
// Purely decorative; ported verbatim from the mockup's canvas algorithm.
export default function HeroCanvas({ width, height, staticVariant = false, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const ctx = cv.getContext("2d");
    const W = cv.width;
    const H = cv.height;
    const N = Math.round((W * H) / 420);
    const pts = [];
    const layers = [6, 10, 12, 8, 4];
    const hubs = [];
    const cx = W / 2;
    const cy = H / 2;
    const spanX = W * 0.62;
    const spanY = H * 0.56;

    layers.forEach((n, li) => {
      const x = cx - spanX / 2 + (spanX * li) / (layers.length - 1);
      for (let i = 0; i < n; i++) {
        hubs.push({ x, y: cy - spanY / 2 + (spanY * (i + 0.5)) / n, li });
      }
    });

    for (let i = 0; i < N; i++) {
      const h = hubs[Math.floor(Math.random() * hubs.length)];
      const a = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.6) * 46;
      pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        tx: h.x + Math.cos(a) * r,
        ty: h.y + Math.sin(a) * r,
        vx: 0,
        vy: 0,
        s: Math.random() < 0.12 ? 3 : 1.6,
        red: Math.random() < 0.09,
      });
    }

    let mx = -9999;
    let my = -9999;
    let t = 0;
    let on = false;
    let raf;

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
        const wob = Math.sin(t * 2 + p.tx * 0.01) * 8;
        p.vx += (p.tx - p.x) * 0.008;
        p.vy += (p.ty + wob - p.y) * 0.008;
        const ddx = p.x - mx;
        const ddy = p.y - my;
        const d2 = ddx * ddx + ddy * ddy;
        if (d2 < 42000) {
          const f = ((42000 - d2) / 42000) * 1.4;
          p.vx += ddx * f * 0.02;
          p.vy += ddy * f * 0.02;
        }
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.red ? "rgba(221,43,15,0.95)" : "rgba(190,208,235,0.75)";
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
      if (on) raf = requestAnimationFrame(tick);
    };

    let io;
    if (staticVariant) {
      for (let i = 0; i < 90; i++) {
        for (const p of pts) {
          p.vx += (p.tx - p.x) * 0.02;
          p.vy += (p.ty - p.y) * 0.02;
          p.vx *= 0.85;
          p.vy *= 0.85;
          p.x += p.vx;
          p.y += p.vy;
        }
      }
      on = false;
      tick();
    } else {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !on) {
              on = true;
              tick();
            } else if (!entry.isIntersecting && on) {
              on = false;
              cancelAnimationFrame(raf);
            }
          }
        },
        { rootMargin: "120px" }
      );
      io.observe(cv);
    }

    return () => {
      on = false;
      cancelAnimationFrame(raf);
      io?.disconnect();
      cv.removeEventListener("mousemove", onMouseMove);
      cv.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [staticVariant]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
