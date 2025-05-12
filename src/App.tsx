
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
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Clientes from "@/pages/Clientes";
import DetalhesCliente from "@/pages/DetalhesCliente";
import OrdensServico from "@/pages/OrdensServico";
import DetalhesOrdemServico from "@/pages/DetalhesOrdemServico";
import Orcamentos from "@/pages/Orcamentos";
import DetalhesOrcamento from "@/pages/DetalhesOrcamento";

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
              <Route path="/configuracoes" element={
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-6">Configurações do Sistema</h2>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow p-4">
                      <h3 className="text-lg font-medium mb-2">Gerenciamento de Usuários</h3>
                      <p className="text-gray-600 mb-3">Adicionar, editar ou remover usuários do sistema</p>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={() => window.location.href = '/usuarios'}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Gerenciar Usuários
                      </Button>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-4">
                      <h3 className="text-lg font-medium mb-2">Configurações Gerais</h3>
                      <p className="text-gray-600">Ajustes gerais do sistema e preferências</p>
                    </div>
                  </div>
                </div>
              } />
              <Route path="/usuarios" element={<div className="p-4">Gerenciamento de Usuários</div>} />
            </Route>
            
            {/* Rotas protegidas para admin e técnicos */}
            <Route 
              element={<ProtectedRoute allowedRoles={['administrador', 'tecnico']} />}
            >
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/clientes/:id" element={<DetalhesCliente />} />
              <Route path="/ordens-servico" element={<OrdensServico />} />
              <Route path="/ordens-servico/:id" element={<DetalhesOrdemServico />} />
              <Route path="/orcamentos" element={<Orcamentos />} />
              <Route path="/orcamentos/:id" element={<DetalhesOrcamento />} />
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
