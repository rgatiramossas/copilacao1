
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  userRole: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users para demonstração
const mockUsers: User[] = [
  {
    id: '1',
    nome: 'Admin',
    email: 'admin@martelo.com',
    role: 'administrador',
  },
  {
    id: '2',
    nome: 'Técnico',
    email: 'tecnico@martelo.com',
    role: 'tecnico',
  },
  {
    id: '3',
    nome: 'Gestor',
    email: 'gestor@martelo.com',
    role: 'gestor',
  },
];

// Senhas para todos são "senha123" (em produção, usaríamos hashing)
const mockPasswords: Record<string, string> = {
  'admin@martelo.com': 'senha123',
  'tecnico@martelo.com': 'senha123',
  'gestor@martelo.com': 'senha123',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se há um usuário salvo no localStorage
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simula uma verificação de login
      // Em produção, isso seria uma chamada de API
      const foundUser = mockUsers.find(user => user.email === email);
      
      if (foundUser && mockPasswords[email] === password) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        toast.success(`Bem-vindo(a), ${foundUser.nome}!`);
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      toast.error('Falha na autenticação. Verifique suas credenciais.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Você saiu do sistema');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        userRole: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
