
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Home, ClipboardList, LogOut, UserCircle, FileText, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface BottomNavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const BottomNavItem = ({
  to,
  label,
  icon,
  active
}: BottomNavItemProps) => {
  return <Link to={to} className="flex flex-col items-center justify-center">
      <div className={`flex flex-col items-center p-2 ${active ? 'text-primary' : 'text-gray-500'}`}>
        {icon}
        <span className="text-xs mt-1">{label}</span>
      </div>
    </Link>;
};

const AppLayout: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const {
    user,
    logout
  } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return <div className="flex flex-col h-screen bg-gray-50">
      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16">
        {/* Header topo - fixo */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4">
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center">
              <img src="/logo.svg" alt="Euro Dent Experts" className="h-12 w-auto" />
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to="/configuracoes" className="text-gray-600 hover:text-primary">
                <Settings size={20} />
              </Link>
              <div className="flex items-center relative group">
                <div className="h-8 w-8 rounded-full bg-blue-deep flex items-center justify-center text-white cursor-pointer">
                  {user?.nome?.charAt(0) || 'U'}
                </div>
                <div className="absolute top-full right-0 mt-1 hidden group-hover:block bg-white border shadow-lg rounded-md p-2 w-32 z-50">
                  <button onClick={logout} className="flex items-center space-x-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-red-500">
                    <LogOut size={16} />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          {children}
        </div>
      </main>
      
      {/* Menu inferior simplificado */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex justify-around items-center z-40">
        <BottomNavItem key="home" to="/dashboard" label="Início" icon={<Home size={20} />} active={isActive('/dashboard')} />
        <BottomNavItem key="clients" to="/clientes" label="Clientes" icon={<UserCircle size={20} />} active={isActive('/clientes') || isActive('/meus-clientes')} />
        <BottomNavItem key="orders" to="/ordens-servico" label="Ordens" icon={<ClipboardList size={20} />} active={isActive('/ordens-servico') || isActive('/minhas-ordens')} />
        <BottomNavItem key="budgets" to="/orcamentos" label="Orçamentos" icon={<FileText size={20} />} active={location.pathname.startsWith('/orcamentos')} />
      </nav>
    </div>;
};

export default AppLayout;
