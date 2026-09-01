import { useEffect, useRef } from 'react';

// Instrument-style waveform readout. Draws a graph-paper grid and a single
// precise trace whose amplitude responds to scroll velocity (reactive=true).
export default function Oscilloscope({
  line = '#131311',
  grid = 'rgba(19,19,17,0.07)',
  accent = '#ff4b00',
  showGrid = true,
  reactive = false,
  baseAmp = 0.55,
  speed = 1,
  className,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let t = 0;
    let amp = baseAmp;
    let targetAmp = baseAmp;
    let lastY = window.scrollY;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, width * dpr);
      canvas.height = Math.max(1, height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      targetAmp = Math.min(1.6, baseAmp + dy * 0.012);
    };
    if (reactive) window.addEventListener('scroll', onScroll, { passive: true });

    const draw = () => {
      const { width: w, height: h } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, w, h);

      if (showGrid) {
        ctx.strokeStyle = grid;
        ctx.lineWidth = 1;
        const step = 36;
        ctx.beginPath();
        for (let x = step; x < w; x += step) {
          ctx.moveTo(x + 0.5, 0);
          ctx.lineTo(x + 0.5, h);
        }
        for (let y = step; y < h; y += step) {
          ctx.moveTo(0, y + 0.5);
          ctx.lineTo(w, y + 0.5);
        }
        ctx.stroke();
      }

      // decay toward base amplitude
      targetAmp += (baseAmp - targetAmp) * 0.02;
      amp += (targetAmp - amp) * 0.08;

      const mid = h / 2;
      const A = (h / 3) * amp;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const p = x * 0.02;
        const y =
          mid +
          Math.sin(p * 0.9 + t * 1.9 * speed) * A * 0.72 +
          Math.sin(p * 2.3 - t * 1.1 * speed) * A * 0.22 +
          Math.sin(p * 5.1 + t * 3.1 * speed) * A * 0.06;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = line;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // leading-edge marker
      const px = w - 3;
      const pp = px * 0.02;
      const py =
        mid +
        Math.sin(pp * 0.9 + t * 1.9 * speed) * A * 0.72 +
        Math.sin(pp * 2.3 - t * 1.1 * speed) * A * 0.22 +
        Math.sin(pp * 5.1 + t * 3.1 * speed) * A * 0.06;
      ctx.beginPath();
      ctx.arc(px, py, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();

      t += 0.016;
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (reactive) window.removeEventListener('scroll', onScroll);
    };
  }, [line, grid, accent, showGrid, reactive, baseAmp, speed]);

  return <canvas ref={ref} className={className} style={{ width: '100%', height: '100%' }} aria-hidden="true" />;
}
