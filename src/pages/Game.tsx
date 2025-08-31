import { useState } from 'react';
import { SpinningWheel } from '@/components/SpinningWheel';
import { Card, CardContent } from '@/components/ui/card';
import { Confetti } from '@/components/Confetti';
import { useToast } from '@/hooks/use-toast';

interface GameProps {
  playerName: string;
  playerContact: string;
}

export const Game = ({ playerName, playerContact }: GameProps) => {
  const [result, setResult] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const { toast } = useToast();

  const handleWin = async (prize: string) => {
    setResult(prize);
    setShowConfetti(true);
    setGameCompleted(true);

    // Simulate API call to save result
    try {
      // await fetch('/saveResult', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ contact: playerContact, prize })
      // });
      
      toast({
        title: "Congratulations! 🎉",
        description: `You won: ${prize}!`,
      });
    } catch (error) {
      console.error('Error saving result:', error);
    }

    // Stop confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-casino-gold mb-2">Welcome, {playerName}!</h2>
        <p className="text-muted-foreground">Ready to spin and win?</p>
      </div>

      <SpinningWheel onWin={handleWin} disabled={gameCompleted} />

      {result && (
        <Card className="w-full max-w-md bg-card border-casino-gold/20 shadow-[var(--shadow-gold)]">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-casino-gold mb-2">🎉 Congratulations!</div>
            <div className="text-lg font-semibold mb-3">You won: {result}!</div>
            <div className="text-sm text-muted-foreground">
              Show this screen to the Salon manager to claim your reward.
            </div>
          </CardContent>
        </Card>
      )}

      <Confetti active={showConfetti} />
    </div>
  );
};