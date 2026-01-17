import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Lock, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading

    if (login(username, password)) {
      toast.success('Welcome back, Administrator!');
      navigate('/');
    } else {
      setError('Invalid username or password');
      toast.error('Login failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-2">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mb-4">
            <GraduationCap className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">EduKenya SMS</CardTitle>
          <CardDescription className="text-base">
            CBC School Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-3 flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>Default credentials:</p>
              <p className="font-mono text-xs mt-1">Username: admin | Password: admin123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
