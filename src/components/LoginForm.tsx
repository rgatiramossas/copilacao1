
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro de login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-deep to-blue-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Martelinho de Ouro</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Button 
                type="submit" 
                className="w-full bg-blue-deep hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Aguarde...' : 'Entrar'}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Credenciais para teste:</p>
            <ul className="mt-1">
              <li>Admin: admin@martelo.com</li>
              <li>Técnico: tecnico@martelo.com</li>
              <li>Gestor: gestor@martelo.com</li>
              <li>Senha para todos: senha123</li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t p-4">
          <span className="text-xs text-muted-foreground">
            Aplicativo de Gestão para Equipes de Martelinho de Ouro
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
