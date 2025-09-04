import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Headphones, Shirt, Coffee, Pen, Ticket } from 'lucide-react';

interface SpinningWheelProps {
  onWin: (prize: string) => void;
  disabled?: boolean;
}

const gifts = ["Free Kerastase Samples", "50% off on haircut", "Complimentary wash", "40% off on foot massage", "999 body therapy", "20% off on loreal hair spa"];
const colors = ["#dec7a6", "#000", "#dec7a6", "#000", "#dec7a6", "#000"];
const giftIcons = [Gift, Headphones, Shirt, Coffee, Pen, Ticket];

export const SpinningWheel = ({ onWin, disabled = false }: SpinningWheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);

  const createIconImage = (IconComponent: any, color: string, size: number = 32) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size.toString());
    svg.setAttribute('height', size.toString());
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', color);
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    
    // Get the icon's path data by creating a temporary React element
    const tempDiv = document.createElement('div');
    const iconElement = IconComponent({ size, color, strokeWidth: 2 });
    
    // This is a simplified approach - in practice you'd need to extract the actual SVG paths
    // For now, we'll use Unicode emojis as a fallback
    const iconEmojis = ["🎁", "🎧", "👕", "☕", "✏️", "🎫"];
    
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = `${size * 0.8}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(iconEmojis[Math.floor(Math.random() * iconEmojis.length)], size/2, size/2);
    }
    
    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numSegments = gifts.length;
    const radius = canvas.width / 2;
    const angle = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Icon emojis for each gift
    const iconEmojis = ["🎁", "🎧", "👕", "☕", "✏️", "🎫"];
ctx.beginPath();
    ctx.arc(radius, radius, radius - 2, 0, 2 * Math.PI);
    ctx.strokeStyle = "#dec7a6";
    ctx.lineWidth = 16;
    ctx.stroke();
    for (let i = 0; i < numSegments; i++) {
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, i * angle, (i + 1) * angle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();

      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(i * angle + angle / 2);
      
      // Draw icon
      /*ctx.font = "32px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(iconEmojis[i], radius - 65, -10);*/
      
      // Draw text
      ctx.textAlign = "center";
ctx.fillStyle = i % 2 === 0 ? "#000" : "#dec7a6";
ctx.font = "bold 14px Arial";

let text = gifts[i];
let words = text.split(" ");

// Break into 3 lines: first word, second word, rest
let line1 = words[0] || "";
let line2 = words[1] || "";
let line3 = words.slice(2).join(" ") || "";

if (line3) {
  ctx.fillText(line1, radius - 65, -15);   // first line
  ctx.fillText(line2, radius - 65, 0);  // second line
  ctx.fillText(line3, radius - 65, 15);  // third line
} else if (line2) {
  ctx.fillText(line1, radius - 65, -10);   // first line
  ctx.fillText(line2, radius - 65, 10);  // second line
} else {
  ctx.fillText(line1, radius - 65, 15);  // single line
}
      
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
<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-casino-gold rounded-full shadow-lg border-4 border-casino-black z-10 flex items-center justify-center">
          <div className="w-4 h-4 bg-casino-black rounded-full"></div>
        </div>
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
