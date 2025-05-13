
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Home, ClipboardList, LogOut, UserCircle, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface BottomNavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const BottomNavItem = ({ to, label, icon, active }: BottomNavItemProps) => {
  return (
    <Link to={to} className="flex flex-col items-center justify-center">
      <div className={`flex flex-col items-center p-2 ${active ? 'text-primary' : 'text-gray-500'}`}>
        {icon}
        <span className="text-xs mt-1">{label}</span>
      </div>
    </Link>
  );
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16">
        {/* Header topo - fixo */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4">
          <div className="flex w-full justify-between items-center">
            <h2 className="text-lg font-medium">
              {/* Título dinâmico com base no caminho */}
              {location.pathname === '/dashboard' && 'Dashboard'}
              {location.pathname === '/usuarios' && 'Gerenciar Usuários'}
              {location.pathname === '/clientes' && 'Gerenciar Clientes'}
              {location.pathname === '/meus-clientes' && 'Meus Clientes'}
              {location.pathname === '/ordens-servico' && 'Ordens de Serviço'}
              {location.pathname === '/minhas-ordens' && 'Minhas Ordens'}
              {location.pathname === '/configuracoes' && 'Configurações'}
              {location.pathname === '/orcamentos' && 'Orçamentos'}
            </h2>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-deep flex items-center justify-center text-white">
                {user?.nome?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          {children}
        </div>
      </main>
      
      {/* Menu inferior simplificado com apenas 4 itens + logout */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex justify-around items-center z-40">
        <BottomNavItem 
          key="home" 
          to="/dashboard" 
          label="Início" 
          icon={<Home size={20} />} 
          active={isActive('/dashboard')} 
        />
        
        <BottomNavItem 
          key="clients" 
          to="/clientes" 
          label="Clientes" 
          icon={<UserCircle size={20} />} 
          active={isActive('/clientes') || isActive('/meus-clientes')} 
        />
        
        <BottomNavItem 
          key="orders" 
          to="/ordens-servico" 
          label="Ordens" 
          icon={<ClipboardList size={20} />} 
          active={isActive('/ordens-servico') || isActive('/minhas-ordens')} 
        />
        
        <BottomNavItem 
          key="budgets" 
          to="/orcamentos" 
          label="Orçamentos" 
          icon={<FileText size={20} />} 
          active={isActive('/orcamentos')} 
        />
        
        <button 
          onClick={logout}
          className="flex flex-col items-center justify-center text-red-500"
        >
          <div className="flex flex-col items-center p-2">
            <LogOut size={20} />
            <span className="text-xs mt-1">Sair</span>
          </div>
        </button>
      </nav>
    </div>
  );
};

export default AppLayout;
