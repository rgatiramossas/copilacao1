
// Mock service for technicians
// In a real application, this would fetch from an API

interface Tecnico {
  id: string;
  nome: string;
  email: string;
}

// Mock data for technicians
const mockTecnicos: Tecnico[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@martelo.com',
  },
  {
    id: '2',
    nome: 'Maria Oliveira',
    email: 'maria@martelo.com',
  },
  {
    id: '3',
    nome: 'Pedro Santos',
    email: 'pedro@martelo.com',
  },
  {
    id: '4',
    nome: 'Ana Costa',
    email: 'ana@martelo.com',
  },
];

export const tecnicoService = {
  getTecnicos: () => mockTecnicos,
  getTecnicoById: (id: string) => mockTecnicos.find(tecnico => tecnico.id === id),
  getTecnicoByEmail: (email: string) => mockTecnicos.find(tecnico => tecnico.email === email),
};

