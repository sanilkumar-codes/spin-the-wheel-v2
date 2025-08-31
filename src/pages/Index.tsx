import { useState } from 'react';
import { UserForm } from '@/components/UserForm';
import { Game } from '@/pages/Game';
import casinoBackground from '@/assets/casino-background.jpg';
import logo from '@/assets/logo.png';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'form' | 'game'>('form');
  const [playerData, setPlayerData] = useState<{ name: string; contact: string } | null>(null);

  const handleFormSubmit = async (name: string, contact: string) => {
    // Simulate API calls from original HTML
    try {
      // Check if user already played
      // const checkRes = await fetch(`/checkUser?contact=${encodeURIComponent(contact)}`);
      // const userData = await checkRes.json();
      
      // if (userData.alreadyPlayed) {
      //   // Handle already played scenario
      //   return;
      // }

      // Register user
      // await fetch('/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, contact })
      // });

      setPlayerData({ name, contact });
      setCurrentPage('game');
    } catch (error) {
      console.error('Error processing user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-casino-black">
      {/* Logo - Always visible at top outside background */}
      <div className="h-[10vh] flex items-center justify-center">
        <img 
          src={logo} 
          alt="Spin and Win Logo" 
          className="h-16 w-16 object-contain"
        />
      </div>

      {/* Main content area with background image (only on first page) */}
      <div 
        className="h-[80vh] flex items-center justify-center relative"
        style={currentPage === 'form' ? {
          backgroundImage: `url(${casinoBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {}}
      >
        {/* Overlay for better text readability on background */}
        {currentPage === 'form' && (
          <div className="absolute inset-0 bg-casino-black/30"></div>
        )}
        
        <div className="relative z-10 w-full max-w-md px-6">
          {currentPage === 'form' ? (
            <div className="text-center space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-casino-gold mb-4 drop-shadow-lg">
                  Spin and Win
                </h1>
                <p className="text-casino-gold-light text-lg drop-shadow">
                  Try your luck and win amazing prizes!
                </p>
              </div>
              <UserForm onSubmit={handleFormSubmit} />
            </div>
          ) : (
            playerData && (
              <Game 
                playerName={playerData.name} 
                playerContact={playerData.contact}
              />
            )
          )}
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-[10vh]"></div>
    </div>
  );
};

export default Index;
