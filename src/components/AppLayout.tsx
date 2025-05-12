
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Home, Users, ClipboardList, LogOut, UserCircle, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ to, label, icon, active, onClick }: SidebarItemProps) => {
  return (
    <Link to={to} onClick={onClick}>
      <div className={`flex items-center space-x-3 py-3 px-4 rounded-lg cursor-pointer transition-all ${
        active ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-100'
      }`}>
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, userRole } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    if (isMobile) {
      setMenuOpen(false);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Renderiza diferentes itens do menu com base no papel do usuário
  const renderMenuItems = () => {
    const baseItems = [
      <SidebarItem 
        key="home" 
        to="/dashboard" 
        label="Dashboard" 
        icon={<Home size={20} />} 
        active={isActive('/dashboard')} 
        onClick={closeMenu} 
      />
    ];
    
    const adminItems = [
      <SidebarItem 
        key="users" 
        to="/usuarios" 
        label="Usuários" 
        icon={<Users size={20} />} 
        active={isActive('/usuarios')} 
        onClick={closeMenu} 
      />,
      <SidebarItem 
        key="settings" 
        to="/configuracoes" 
        label="Configurações" 
        icon={<Settings size={20} />} 
        active={isActive('/configuracoes')} 
        onClick={closeMenu} 
      />
    ];

    const commonItems = [
      <SidebarItem 
        key="clients" 
        to="/clientes" 
        label="Clientes" 
        icon={<UserCircle size={20} />} 
        active={isActive('/clientes')} 
        onClick={closeMenu} 
      />,
      <SidebarItem 
        key="orders" 
        to="/ordens-servico" 
        label="Ordens de Serviço" 
        icon={<ClipboardList size={20} />} 
        active={isActive('/ordens-servico')} 
        onClick={closeMenu} 
      />
    ];

    if (userRole === 'administrador') {
      return [...baseItems, ...commonItems, ...adminItems];
    } else if (userRole === 'tecnico') {
      return [...baseItems, ...commonItems];
    } else {
      return [
        ...baseItems,
        <SidebarItem 
          key="clients" 
          to="/meus-clientes" 
          label="Meus Clientes" 
          icon={<UserCircle size={20} />} 
          active={isActive('/meus-clientes')} 
          onClick={closeMenu} 
        />,
        <SidebarItem 
          key="orders" 
          to="/minhas-ordens" 
          label="Minhas Ordens" 
          icon={<ClipboardList size={20} />} 
          active={isActive('/minhas-ordens')} 
          onClick={closeMenu} 
        />
      ];
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar para desktop */}
      <aside className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out w-64 bg-white shadow-lg' : 'w-64 bg-white shadow-lg hidden md:block'}
        ${menuOpen && isMobile ? 'translate-x-0' : isMobile ? '-translate-x-full' : ''}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 bg-blue-deep text-white">
            <h1 className="text-xl font-bold">Martelinho de Ouro</h1>
          </div>
          
          <div className="p-4 flex flex-col justify-between h-full">
            <nav className="space-y-1">
              {renderMenuItems()}
            </nav>
            
            <div className="mt-auto pt-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={logout}
              >
                <LogOut size={18} />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay para fechar o menu em dispositivos móveis */}
      {menuOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header topo - fixo */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4 md:px-6">
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center">
              {isMobile && (
                <button 
                  onClick={toggleMenu} 
                  className="mr-4 focus:outline-none"
                >
                  {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              )}
              <h2 className="text-lg font-medium">
                {/* Título dinâmico com base no caminho */}
                {location.pathname === '/dashboard' && 'Dashboard'}
                {location.pathname === '/usuarios' && 'Gerenciar Usuários'}
                {location.pathname === '/clientes' && 'Gerenciar Clientes'}
                {location.pathname === '/meus-clientes' && 'Meus Clientes'}
                {location.pathname === '/ordens-servico' && 'Ordens de Serviço'}
                {location.pathname === '/minhas-ordens' && 'Minhas Ordens'}
                {location.pathname === '/configuracoes' && 'Configurações'}
              </h2>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2 hidden md:block">
                {user?.nome || 'Usuário'}
              </span>
              <div className="h-8 w-8 rounded-full bg-blue-deep flex items-center justify-center text-white">
                {user?.nome?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
