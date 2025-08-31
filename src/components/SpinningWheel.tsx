import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface SpinningWheelProps {
  onWin: (prize: string) => void;
  disabled?: boolean;
}

const gifts = ["Gift Card", "Headphones", "T-Shirt", "Mug", "Pen", "Discount Coupon"];
const colors = ["#dec7a6", "#000", "#dec7a6", "#000", "#dec7a6", "#000"];

export const SpinningWheel = ({ onWin, disabled = false }: SpinningWheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numSegments = gifts.length;
    const radius = canvas.width / 2;
    const angle = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numSegments; i++) {
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, i * angle, (i + 1) * angle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();

      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(i * angle + angle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = i % 2 === 0 ? "#000" : "#dec7a6";
      ctx.font = "bold 16px Arial";
      ctx.fillText(gifts[i], radius - 10, 5);
      ctx.restore();
    }
  };

  useEffect(() => {
    drawWheel();
  }, []);

  const spin = () => {
    if (spinning || disabled) return;

    setSpinning(true);
    const spins = 5 + Math.floor(Math.random() * 4);
    const randomDeg = Math.random() * 360;
    const totalDeg = spins * 360 + randomDeg;
    const targetRotation = currentRotation + totalDeg;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.transition = 'transform 5s cubic-bezier(.33,1,.68,1)';
      canvas.style.transform = `rotate(${targetRotation}deg)`;
    }

    setTimeout(() => {
      const finalRotation = targetRotation % 360;
      setCurrentRotation(finalRotation);
      
      const adjustedDeg = (finalRotation + 90) % 360;
      const anglePerSegment = 360 / gifts.length;
      const index = Math.floor(gifts.length - (adjustedDeg / anglePerSegment)) % gifts.length;
      const prize = gifts[index];
      
      onWin(prize);
      setSpinning(false);
    }, 5200);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-80 h-80">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-b-[28px] border-l-transparent border-r-transparent border-b-casino-gold"></div>
        </div>
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="rounded-full shadow-[var(--shadow-gold)]"
        />
      </div>
      <Button
        onClick={spin}
        disabled={spinning || disabled}
        variant="default"
        size="lg"
        className="text-xl px-8 py-4 bg-casino-gold text-casino-black hover:bg-casino-gold-dark disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-[var(--shadow-gold)]"
      >
        {spinning ? '🎡 Spinning...' : '🎡 Spin'}
      </Button>
    </div>
  );
};