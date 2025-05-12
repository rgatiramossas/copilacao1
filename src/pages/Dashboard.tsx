
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck, ClipboardList, UserCircle, DollarSign, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { userRole } = useAuth();
  
  // Dados simulados para o dashboard
  const adminStats = [
    { title: 'Ordens Abertas', value: '12', icon: <ClipboardList className="h-6 w-6 text-blue-500" /> },
    { title: 'Ordens Concluídas', value: '45', icon: <ClipboardCheck className="h-6 w-6 text-green-500" /> },
    { title: 'Total de Clientes', value: '27', icon: <UserCircle className="h-6 w-6 text-purple-500" /> },
    { title: 'Receita Mensal', value: 'R$ 8.250,00', icon: <DollarSign className="h-6 w-6 text-yellow-500" /> },
  ];
  
  const tecnicoStats = [
    { title: 'Minhas Ordens Abertas', value: '4', icon: <ClipboardList className="h-6 w-6 text-blue-500" /> },
    { title: 'Minhas Ordens Concluídas', value: '15', icon: <ClipboardCheck className="h-6 w-6 text-green-500" /> },
    { title: 'Meus Clientes', value: '9', icon: <UserCircle className="h-6 w-6 text-purple-500" /> },
    { title: 'Próximo Serviço', value: 'Hoje, 14h', icon: <Calendar className="h-6 w-6 text-red-500" /> },
  ];
  
  const gestorStats = [
    { title: 'Clientes Atribuídos', value: '6', icon: <UserCircle className="h-6 w-6 text-purple-500" /> },
    { title: 'Ordens em Andamento', value: '3', icon: <ClipboardList className="h-6 w-6 text-blue-500" /> },
    { title: 'Orçamentos Pendentes', value: '2', icon: <DollarSign className="h-6 w-6 text-yellow-500" /> },
    { title: 'Serviços Concluídos', value: '8', icon: <ClipboardCheck className="h-6 w-6 text-green-500" /> },
  ];
  
  // Seleciona estatísticas baseadas no papel do usuário
  const stats = userRole === 'administrador' 
    ? adminStats 
    : userRole === 'tecnico' 
      ? tecnicoStats 
      : gestorStats;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">
          Dashboard {userRole === 'administrador' ? 'Administrativo' : 
                    userRole === 'tecnico' ? 'do Técnico' : 'do Gestor'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Nova OS criada</p>
                  <p className="text-sm text-muted-foreground">Cliente: João Silva</p>
                </div>
                <span className="text-xs text-muted-foreground">Hoje, 10:42</span>
              </li>
              <li className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Orçamento aprovado</p>
                  <p className="text-sm text-muted-foreground">OS #2458 - R$ 350,00</p>
                </div>
                <span className="text-xs text-muted-foreground">Ontem, 15:30</span>
              </li>
              <li className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Serviço concluído</p>
                  <p className="text-sm text-muted-foreground">OS #2445 - Maria Oliveira</p>
                </div>
                <span className="text-xs text-muted-foreground">Ontem, 11:15</span>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Novo cliente cadastrado</p>
                  <p className="text-sm text-muted-foreground">Pedro Santos</p>
                </div>
                <span className="text-xs text-muted-foreground">23/05, 09:20</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {userRole === 'administrador' 
                ? 'Desempenho da Equipe' 
                : userRole === 'tecnico' 
                  ? 'Seu Desempenho' 
                  : 'Status dos Clientes'}
            </CardTitle>
            <CardDescription>
              {userRole === 'administrador' 
                ? 'Visão geral da produtividade' 
                : userRole === 'tecnico' 
                  ? 'Resumo dos seus serviços' 
                  : 'Resumo das contas gerenciadas'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userRole === 'administrador' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Técnico 1</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-[85%]"></div>
                  </div>
                </div>
              )}
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {userRole === 'administrador' 
                      ? 'Técnico 2' 
                      : userRole === 'tecnico' 
                        ? 'Serviços Concluídos' 
                        : 'Ordens Aprovadas'}
                  </span>
                  <span className="text-sm font-medium">70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-[70%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {userRole === 'administrador' 
                      ? 'Técnico 3' 
                      : userRole === 'tecnico' 
                        ? 'Satisfação do Cliente' 
                        : 'Orçamentos Pendentes'}
                  </span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full w-[92%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {userRole === 'administrador' 
                      ? 'Gestor 1' 
                      : userRole === 'tecnico' 
                        ? 'Tempo Médio de Conclusão' 
                        : 'Taxa de Aprovação'}
                  </span>
                  <span className="text-sm font-medium">63%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full w-[63%]"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
