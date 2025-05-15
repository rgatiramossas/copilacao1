
import { Home, ClipboardList, Users, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t h-16 flex items-center justify-around md:hidden">
      <button 
        onClick={() => navigate('/dashboard')}
        className={`flex flex-col items-center space-y-1 ${location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <Home size={24} />
        <span className="text-xs">Home</span>
      </button>
      
      <button 
        onClick={() => navigate('/ordens-servico')}
        className={`flex flex-col items-center space-y-1 ${location.pathname.includes('ordens-servico') ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <ClipboardList size={24} />
        <span className="text-xs">Ordens</span>
      </button>
      
      <button 
        onClick={() => navigate('/clientes')}
        className={`flex flex-col items-center space-y-1 ${location.pathname.includes('clientes') ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <Users size={24} />
        <span className="text-xs">Clientes</span>
      </button>
      
      <button 
        onClick={() => navigate('/configuracoes')}
        className={`flex flex-col items-center space-y-1 ${location.pathname === '/configuracoes' ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <Settings size={24} />
        <span className="text-xs">Config</span>
      </button>
    </div>
  );
}
