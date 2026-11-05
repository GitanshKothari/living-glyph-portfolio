import { useEffect, useRef } from "react";
type Point = { x: number; y: number };
const cache = new Map<string, Point[]>();
function layout(word: string): Point[] {
  if (cache.has(word)) return cache.get(word)!;
  const c = document.createElement("canvas");
  c.width = 800;
  c.height = 320;
  const x = c.getContext("2d")!;
  if (word) {
    x.font = `900 ${Math.min(155, (660 / Math.max(word.length, 1)) * 1.45)}px Arial`;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(word.toUpperCase(), 400, 165, 740);
  } else {
    x.translate(400, 160);
    x.scale(1.42, 1.42);
    x.translate(-400, -140);
    [
      [310, 50, 0],
      [400, 50, 1],
      [310, 140, 3],
      [400, 140, 2],
    ].forEach(([a, b, r]) => {
      x.save();
      x.translate(a + 45, b + 45);
      x.rotate((r * Math.PI) / 2);
      x.beginPath();
      x.moveTo(-44, 44);
      x.lineTo(-44, 0);
      x.arc(0, 0, 44, Math.PI, Math.PI * 1.5);
      x.lineTo(44, -44);
      x.lineTo(44, 44);
      x.closePath();
      x.fill();
      x.globalCompositeOperation = "destination-out";
      x.beginPath();
      x.arc(40, 40, 24, 0, Math.PI * 2);
      x.fill();
      x.restore();
    });
  }
  const data = x.getImageData(0, 0, 800, 320).data,
    points: Point[] = [];
  for (let y = 0; y < 320; y += 5)
    for (let z = 0; z < 800; z += 5)
      if (data[(y * 800 + z) * 4 + 3] > 150) points.push({ x: z, y });
  const bounded = Array.from(
    { length: 3600 },
    (_, i) =>
      points[Math.floor((i * points.length) / 3600)] || { x: 400, y: 160 },
  );
  cache.set(word, bounded);
  return bounded;
}
export function Glyph({
  word = "",
  reduced = false,
  initialWord = "",
}: {
  word?: string;
  reduced?: boolean;
  initialWord?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null),
    points = useRef<Point[]>([]);
  useEffect(() => {
    const c = ref.current!,
      ctx = c.getContext("2d")!;
    const target = layout(reduced ? "" : word);
    let raf = 0,
      visible = true;
    const start = performance.now(),
      from = points.current.length ? points.current : layout(initialWord);
    let offset = { x: 0, y: 0 };
    function paint(now: number) {
      if (!visible) return;
      const w = c.clientWidth,
        h = c.clientHeight,
        dpr = Math.min(devicePixelRatio, 2);
      if (c.width !== w * dpr || c.height !== h * dpr) {
        c.width = w * dpr;
        c.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const scale = Math.min(w / (word && !reduced ? 800 : 500), h / 320),
        ox = (w - 800 * scale) / 2,
        oy = (h - 320 * scale) / 2;
      const t = reduced
          ? 1
          : Math.min((now - start) / (w < 600 ? 260 : 400), 1),
        ease = 1 - Math.pow(1 - t, 3);
      points.current = target.map((p, i) => ({
        x: from[i].x + (p.x - from[i].x) * ease,
        y: from[i].y + (p.y - from[i].y) * ease,
      }));
      ctx.fillStyle = "#eeeae2";
      for (const p of points.current)
        ctx.fillRect(
          ox + (p.x + offset.x) * scale,
          oy + (p.y + offset.y) * scale,
          5.15 * scale,
          5.15 * scale,
        );
      if (t < 1) raf = requestAnimationFrame(paint);
    }
    const redraw = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    };
    const resize = new ResizeObserver(redraw);
    resize.observe(c);
    const visibility = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) redraw();
      else cancelAnimationFrame(raf);
    });
    visibility.observe(c);
    const move = (e: PointerEvent) => {
      if (reduced || word || e.pointerType !== "mouse") return;
      const r = c.getBoundingClientRect();
      offset = {
        x: Math.max(-6, Math.min(6, (e.clientX - r.left - r.width / 2) * 0.02)),
        y: Math.max(-6, Math.min(6, (e.clientY - r.top - r.height / 2) * 0.02)),
      };
      redraw();
    };
    const leave = () => {
      offset = { x: 0, y: 0 };
      redraw();
    };
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerleave", leave);
    redraw();
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      visibility.disconnect();
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerleave", leave);
    };
  }, [word, reduced, initialWord]);
  return <canvas ref={ref} className="glyph" aria-hidden="true" />;
}
