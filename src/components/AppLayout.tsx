
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Home, Users, ClipboardList, LogOut, UserCircle, Settings, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

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

  // Renderiza os itens do menu inferior baseado no papel do usuário
  const renderBottomNavItems = () => {
    const baseItems = [
      <BottomNavItem 
        key="home" 
        to="/dashboard" 
        label="Início" 
        icon={<Home size={20} />} 
        active={isActive('/dashboard')} 
      />
    ];
    
    const adminItems = [
      <BottomNavItem 
        key="users" 
        to="/usuarios" 
        label="Usuários" 
        icon={<Users size={20} />} 
        active={isActive('/usuarios')} 
      />,
      <BottomNavItem 
        key="settings" 
        to="/configuracoes" 
        label="Config." 
        icon={<Settings size={20} />} 
        active={isActive('/configuracoes')} 
      />
    ];

    const commonItems = [
      <BottomNavItem 
        key="clients" 
        to="/clientes" 
        label="Clientes" 
        icon={<UserCircle size={20} />} 
        active={isActive('/clientes')} 
      />,
      <BottomNavItem 
        key="orders" 
        to="/ordens-servico" 
        label="Ordens" 
        icon={<ClipboardList size={20} />} 
        active={isActive('/ordens-servico')} 
      />
    ];

    const gestorItems = [
      <BottomNavItem 
        key="clients" 
        to="/meus-clientes" 
        label="Clientes" 
        icon={<UserCircle size={20} />} 
        active={isActive('/meus-clientes')} 
      />,
      <BottomNavItem 
        key="orders" 
        to="/minhas-ordens" 
        label="Ordens" 
        icon={<ClipboardList size={20} />} 
        active={isActive('/minhas-ordens')} 
      />
    ];

    if (userRole === 'administrador') {
      return [...baseItems, ...commonItems, ...adminItems];
    } else if (userRole === 'tecnico') {
      return [...baseItems, ...commonItems];
    } else {
      return [...baseItems, ...gestorItems];
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Sidebar para desktop - apenas visível em telas maiores */}
      <aside className={`
        ${menuOpen ? 'fixed inset-y-0 left-0 z-50 transform translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white shadow-lg' : 'fixed inset-y-0 left-0 z-50 transform -translate-x-full transition-transform duration-300 ease-in-out w-64 bg-white shadow-lg'}
        md:hidden
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 bg-blue-deep text-white px-4">
            <h1 className="text-xl font-bold">Martelinho de Ouro</h1>
            <button onClick={toggleMenu} className="focus:outline-none">
              <X size={24} />
            </button>
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
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Conteúdo principal com espaço para o menu inferior em mobile */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16">
        {/* Header topo - fixo */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4">
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={toggleMenu} 
                className="mr-4 focus:outline-none md:hidden"
              >
                <Menu size={24} />
              </button>
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
        
        {/* Menu inferior fixo para mobile */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex justify-around items-center z-40 md:hidden">
          {renderBottomNavItems()}
          
          {/* Botão de logout para mobile no menu inferior */}
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
      </main>
    </div>
  );
};

export default AppLayout;
