
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import NoPermission from "@/pages/NoPermission";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rota pública */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/sem-permissao" element={<NoPermission />} />

            {/* Rotas protegidas para todos os usuários */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            
            {/* Rotas protegidas só para admin */}
            <Route 
              element={<ProtectedRoute allowedRoles={['administrador']} />}
            >
              <Route path="/usuarios" element={<div className="p-4">Gerenciamento de Usuários</div>} />
              <Route path="/configuracoes" element={<div className="p-4">Configurações do Sistema</div>} />
            </Route>
            
            {/* Rotas protegidas para admin e técnicos */}
            <Route 
              element={<ProtectedRoute allowedRoles={['administrador', 'tecnico']} />}
            >
              <Route path="/clientes" element={<div className="p-4">Lista de todos os clientes</div>} />
              <Route path="/ordens-servico" element={<div className="p-4">Todas as ordens de serviço</div>} />
            </Route>
            
            {/* Rotas protegidas para gestores */}
            <Route 
              element={<ProtectedRoute allowedRoles={['gestor']} />}
            >
              <Route path="/meus-clientes" element={<div className="p-4">Meus clientes gerenciados</div>} />
              <Route path="/minhas-ordens" element={<div className="p-4">Ordens dos meus clientes</div>} />
            </Route>
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
