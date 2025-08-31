import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

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
      onSubmit(name, contact);
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
            {loading ? 'Loading...' : 'Continue'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};