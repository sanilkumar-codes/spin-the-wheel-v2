import { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
}

export const Confetti = ({ active }: ConfettiProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: Math.random() * 6 + 4,
      s: Math.random() * 3 + 2,
      d: Math.random() * Math.PI * 2
    }));

    const startTime = Date.now();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      confetti.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${Math.random() * 360}, 80%, 50%)`;
        ctx.fill();
        
        c.y += c.s;
        if (c.y > canvas.height) c.y = -10;
      });

      if (Date.now() - startTime < 5000) {
        animationIdRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationIdRef.current = null;
      }
    };

    draw();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-50"
      style={{ display: active ? 'block' : 'none' }}
    />
  );
};