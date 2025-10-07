import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Headphones, Shirt, Coffee, Pen, Ticket } from 'lucide-react';

interface SpinningWheelProps {
  onWin: (prize: string) => void;
  disabled?: boolean;
}

const gifts = ["Buy 1 Get 1 Pedicure", "Buy 1 Get 1 Gel nail Polish", "Buy 1 Get 1 Loreal spa", "Buy 1 Get 1 Body Relaxing Session", "Free Haircut"];
//const colors = ["#dec7a6", "#000", "#dec7a6", "#000", "#dec7a6", "#000"];
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
const drawRadius = radius - 15; // Leave space for glow
  const angle = (2 * Math.PI) / numSegments;
  const innerRadius = radius * 0.15;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Icon emojis for each gift
  const iconEmojis = ["🎁", "🎧", "👕", "☕", "✏️", "🎫"];

  // Create gradient for glass effect
  const outerGradient = ctx.createRadialGradient(radius, radius, innerRadius, radius, radius, radius);
  outerGradient.addColorStop(0, 'rgba(222, 199, 166, 0.1)');
  outerGradient.addColorStop(0.7, 'rgba(222, 199, 166, 0.05)');
  outerGradient.addColorStop(0.9, 'rgba(0, 0, 0, 0.3)');

  // Draw outer glass border with glow
  ctx.beginPath();
  ctx.arc(radius, radius, drawRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(222, 199, 166, 0.6)';
  ctx.lineWidth = 3;
  ctx.shadowColor = 'rgba(222, 199, 166, 0.8)';
  ctx.shadowBlur = 15;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Draw segments with transparency
  for (let i = 0; i < numSegments; i++) {
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, drawRadius, i * angle, (i + 1) * angle);
    
    // Alternate between semi-transparent gold and dark
    if (i % 2 === 0) {
      // Create radial gradient for glass gold segments
      const segmentGradient = ctx.createRadialGradient(radius, radius, innerRadius, radius, radius, drawRadius);
      segmentGradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
      segmentGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
      segmentGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
      ctx.fillStyle = segmentGradient;
    } else {
      // Create radial gradient for dark segments
      const segmentGradient = ctx.createRadialGradient(radius, radius, innerRadius, radius, radius, drawRadius);
      segmentGradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
      segmentGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
      segmentGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
      ctx.fillStyle = segmentGradient;
    }
    
    ctx.fill();

    // Draw subtle segment borders with glow
    ctx.beginPath();
    ctx.moveTo(radius + innerRadius * Math.cos(i * angle), radius + innerRadius * Math.sin(i * angle));
    ctx.lineTo(radius + (drawRadius) * Math.cos(i * angle), radius + (drawRadius) * Math.sin(i * angle));
    ctx.strokeStyle = 'rgba(222, 199, 166, 0.4)';
    ctx.lineWidth = 1;
    
    ctx.stroke();
    

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(i * angle + angle / 2);
    
    // Draw icon with glow effect
   /* ctx.font = "28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = 'rgba(222, 199, 166, 0.8)';
    ctx.shadowBlur = 8;
    ctx.fillText(iconEmojis[i], radius - 100, -8);
    ctx.shadowBlur = 0; */
    
    // Draw text with glass effect
    ctx.textAlign = "center";
    ctx.fillStyle = i % 2 === 0 ? 'rgba(222, 199, 166, 1)' : 'rgba(222, 199, 166, 1)';
    ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif";
    ctx.shadowColor = 'rgba(222, 199, 166, 0.8)';
    ctx.shadowBlur = 20;
    let text = gifts[i];
let words = text.split(" ");

// Break into 3 lines: first word, second word, rest
let line1 = (words[0] || "")+(words[0]?" ":"")+(words[1] || "");
let line2 = (words[2] || "")+(words[2]?" ":"")+(words[3] || "");
let line3= (words[4] || "")+(words[4]?" ":"")+(words[5] || "");
let line4 = words.slice(6).join(" ") || "";

if(line4){
  ctx.fillText(line1, drawRadius - 65, -30);   // first line
  ctx.fillText(line2, drawRadius - 65, -10);  // second line
  ctx.fillText(line3, drawRadius - 65, 10);  // third line
  ctx.fillText(line4, drawRadius - 65, 30);
}
else if (line3) {
  ctx.fillText(line1, drawRadius - 65, -15);   // first line
  ctx.fillText(line2, drawRadius - 65, 0);  // second line
  ctx.fillText(line3, drawRadius - 65, 15);  // third line
} else if (line2) {
  ctx.fillText(line1, drawRadius - 65, -10);   // first line
  ctx.fillText(line2, drawRadius - 65, 10);  // second line
} else {
  ctx.fillText(line1, drawRadius - 65, 15);  // single line
}
    
    
    ctx.restore();
// Draw consistent outer border with glow
ctx.beginPath();
ctx.arc(radius, radius, drawRadius, 0, 2 * Math.PI);
ctx.strokeStyle = 'rgba(222, 199, 166, 0.6)';
ctx.lineWidth = 2;
ctx.shadowColor = 'rgba(222, 199, 166, 0.8)';
ctx.shadowBlur = 8;
ctx.stroke();
ctx.shadowBlur = 0;
  }


  // Draw inner circle with glass effect
  const innerGradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, innerRadius);
  innerGradient.addColorStop(0, 'rgba(222, 199, 166, 0.8)');
  innerGradient.addColorStop(0.6, 'rgba(222, 199, 166, 0.6)');
  innerGradient.addColorStop(1, 'rgba(222, 199, 166, 0.4)');
  
  ctx.beginPath();
  ctx.arc(radius, radius, innerRadius, 0, 2 * Math.PI);
  ctx.fillStyle = innerGradient;
  ctx.fill();
  
  // Add glass highlight to inner circle
  ctx.strokeStyle = 'rgba(222, 199, 166, 0.8)';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(222, 199, 166, 1)';
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Draw center dot with glow
  ctx.beginPath();
  ctx.arc(radius, radius, 8, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(222, 199, 166, 0.9)';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(222, 199, 166, 1)';
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Add overall glass overlay effect
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = outerGradient;
  ctx.beginPath();
  ctx.arc(radius, radius, drawRadius - 4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
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

  // REPLACE the entire return statement WITH:
return (
  <div className="flex flex-col items-center gap-4 p-0" >
    <div className="relative w-97 h-97">
      {/* Elegant pointer with glass effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-20">
        <div className="relative">
          <div 
            className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-casino-gold"
            style={{
              filter: 'drop-shadow(0 0 10px hsl(var(--casino-gold) / 0.8))',
            }}
          ></div>
          <div 
            className="absolute top-[35px] left-1/2 transform -translate-x-1/2 w-2 h-6 bg-casino-gold rounded-b-full"
            style={{
              filter: 'drop-shadow(0 0 5px hsl(var(--casino-gold) / 0.6))',
            }}
          ></div>
        </div>
      </div>
      
      {/* Wheel container with luxury glass styling and glass ring effects */}
      <div 
        className="relative w-full h-full rounded-full p-2  flex items-center justify-center backdrop-blur-sm"
        style={{
          background: 'var(--gradient-glass)',
          boxShadow: 'var(--shadow-glass)',
          border: '1px solid hsl(var(--glass-border))',

        }}
      >
{/* Glass background fill in the space between wheel and container */}
<div 
  className="absolute inset-2 rounded-full pointer-events-none"
  style={{
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 65%, rgba(222,199,166,0.15) 75%, transparent 100%)',
    backdropFilter: 'blur(5px)',
  }}
/>

        {/* Outer glass ring with glow */}
        <div 
          className="absolute inset-2 rounded-full"
          style={{
            background: 'radial-gradient(circle, transparent 75%, hsl(var(--casino-gold) / 0.15) 80%, hsl(var(--casino-gold) / 0.25) 85%, transparent 90%)',
            border: '1px solid hsl(var(--casino-gold) / 0.4)',
            boxShadow: 'inset 0 0 25px hsl(var(--casino-gold) / 0.2), 0 0 40px hsl(var(--casino-gold) / 0.4), 0 0 60px hsl(var(--casino-gold) / 0.2)',
          }}
        />
        
        {/* Middle glass ring with glow */}
        <div 
          className="absolute inset-4 rounded-full"
          style={{
            background: 'radial-gradient(circle, transparent 80%, hsl(var(--casino-gold) / 0.1) 85%, hsl(var(--casino-gold) / 0.2) 90%, transparent 95%)',
            border: '1px solid hsl(var(--casino-gold) / 0.3)',
            boxShadow: 'inset 0 0 20px hsl(var(--casino-gold) / 0.15), 0 0 30px hsl(var(--casino-gold) / 0.3)',
          }}
        />
        
        {/* Inner glass ring with glow */}
        <div 
          className="absolute inset-6 rounded-full"
          style={{
            background: 'radial-gradient(circle, transparent 85%, hsl(var(--casino-gold) / 0.08) 90%, hsl(var(--casino-gold) / 0.15) 95%, transparent 100%)',
            border: '1px solid hsl(var(--casino-gold) / 0.25)',
            boxShadow: 'inset 0 0 15px hsl(var(--casino-gold) / 0.1), 0 0 25px hsl(var(--casino-gold) / 0.25)',
          }}
        />
        
        <canvas
          ref={canvasRef}
          width={350}
          height={350}
          className="rounded-full relative z-10"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(222, 199, 166, 0.3))',
            background: 'radial-gradient(circle, rgba(222, 199, 166, 0.05), rgba(0, 0, 0, 0.8))',
          }}
        />

      </div>
      
      {/* Center hub with enhanced glass effect */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-casino-gold rounded-full z-10 flex items-center justify-center backdrop-blur-sm"
        style={{
          background: 'radial-gradient(circle, hsl(var(--casino-gold) / 0.9), hsl(var(--casino-gold) / 0.7))',
          boxShadow: 'inset 0 2px 4px hsl(var(--casino-gold) / 0.3), 0 0 20px hsl(var(--casino-gold) / 0.6)',
          border: '2px solid hsl(var(--casino-gold) / 0.8)',
        }}
      >
        <div 
          className="w-6 h-6 bg-casino-black rounded-full"
          style={{
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        ></div>
      </div>
    </div>
    
    <Button
      onClick={spin}
      disabled={spinning || disabled}
      size="lg"
      className="text-xl px-12 py-6 bg-casino-gold text-casino-black hover:bg-casino-gold-light disabled:opacity-50 disabled:cursor-not-allowed font-bold rounded-xl border border-casino-gold-light backdrop-blur-sm transition-[var(--transition-smooth)] hover:scale-105"
      style={{
        background: 'var(--gradient-gold)',
        boxShadow: 'var(--shadow-gold)',
        filter: spinning ? 'brightness(0.8)' : 'brightness(1)',
      }}
    >
      {spinning ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">🎡</span> 
          Spinning...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          🎡 SPIN THE WHEEL
        </span>
      )}
    </Button>
  </div>
);
}
