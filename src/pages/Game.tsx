import { useState } from 'react';
import { SpinningWheel } from '@/components/SpinningWheel';
import { Card, CardContent } from '@/components/ui/card';
import { Confetti } from '@/components/Confetti';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface GameProps {
  playerName: string;
  playerContact: string;
  onBackToForm: () => void;
}

export const Game = ({ playerName, playerContact, onBackToForm }: GameProps) => {
  const [result, setResult] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const { toast } = useToast();

  const handleWin = async (prize: string) => {
    setResult(prize);
    setShowConfetti(true);
    setGameCompleted(true);
    setShowCongratulations(true);

    // Save result to backend
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/saveResult`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: playerContact, prize })
      });
    } catch (error) {
      console.error('Error saving result:', error);
    }

    // Stop confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleCloseModal = () => {
    setShowCongratulations(false);
    onBackToForm();
  };
const prizeImages: Record<string, string> = {
  "Free Kerastase Samples": "/assets/samples.jpg",
  "50% off on haircut": "/assets/haircut.jpg",
  "Complimentary wash": "/assets/wash.jpg",
  "40% off on foot massage": "/assets/footmassage.jpg",
  "999 body therapy": "/assets/bodymassage.jpg",
  "20% off on loreal hair spa": "/assets/hairspa.jpg",
};

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-casino-gold mb-2" style={{ fontFamily: '"Baskerville Old Face", serif' }}>Welcome, {playerName}!</h2>
        <p className="text-muted-foreground">Ready to spin and win?</p>
      </div>

      <SpinningWheel onWin={handleWin} disabled={gameCompleted} />

      

      {/* Congratulations Popup */}
      <Dialog open={showCongratulations} onOpenChange={(open) => {
  if (!open) {
    handleCloseModal();
  }
}}>

        <DialogContent className="bg-card border-casino-gold/20 shadow-[var(--shadow-gold)]">
			{/* Image above Congratulations */}
  <div className="flex justify-center mb-4">
    <img 
      src={prizeImages[result]}   // 👈 replace with your image path (e.g. /assets/logo.png)
      alt={result}
      className="w-90 h-80 object-contain"
    />
  </div>
          <DialogHeader>
            <DialogTitle className="text-center text-casino-gold text-2xl font-bold">
              🎉 Congratulations!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="text-xl font-semibold mb-4">You won: {result}!</div>
	    <div className="text-sm font-semibold mb-4">
              Show this screen to the Salon manager to claim your reward.
            </div>
            <Button
              onClick={handleCloseModal}
              className="bg-casino-gold text-casino-black hover:bg-casino-gold-dark font-bold"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Confetti active={showConfetti} />
    </div>
  );
};
