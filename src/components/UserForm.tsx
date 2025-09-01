import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface UserFormProps {
  onSubmit: (name: string, contact: string) => void;
}

export const UserForm = ({ onSubmit }: UserFormProps) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !contact.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both name and contact number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Check if user already played
      const checkRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/checkUser?contact=${encodeURIComponent(contact)}`);
      const userData = await checkRes.json();
      
      if (userData.alreadyPlayed) {
        toast({
          title: "Already Played",
          description: `You already won: ${userData.prize}! Show this screen to the Salon manager.`,
          variant: "destructive"
        });
        return;
      }

      // Register user
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact })
      });

      onSubmit(name, contact);
    } catch (error) {
      console.error('Error processing user:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card border-casino-gold/20 shadow-[var(--shadow-gold)]">
      <CardHeader>
        <CardTitle className="text-center text-casino-gold text-2xl font-bold">
          Enter Your Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-input border-casino-gold/30 text-foreground placeholder:text-muted-foreground focus:border-casino-gold focus:ring-casino-gold"
            />
          </div>
          <div>
            <Input
              type="tel"
              placeholder="Contact Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="bg-input border-casino-gold/30 text-foreground placeholder:text-muted-foreground focus:border-casino-gold focus:ring-casino-gold"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-casino-gold text-casino-black hover:bg-casino-gold-dark font-bold py-3 shadow-[var(--shadow-gold)] transition-[var(--transition-smooth)]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
