// API Client para conectar com o backend Spring Boot

const API_BASE_URL = 'http://localhost:8080';

// Tipos mapeados do backend
export interface ClienteDTO {
  id?: string;
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cpfCnpj?: string;
  dataNascimento?: string;
  observacoes?: string;
  ativo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CardapioItemDTO {
  id?: string;
  categoria: string;
  nome: string;
  preco: number;
  descricao?: string;
  ativo?: boolean;
  ordem?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PedidoDTO {
  id?: string;
  clienteId: string;
  nomeCliente?: string;
  valorTotal: number;
  status: string;
  canal: string;
  dataCriacao?: string;
  dataEntrega?: string;
  observacoes?: string;
  itens?: PedidoItemDTO[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PedidoItemDTO {
  id?: string;
  nomeItem: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  nome: string;
  email: string;
  role: string;
}

// Token storage
let authToken: string | null = localStorage.getItem('auth_token');

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('auth_token', token);
};

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('auth_token');
};

export const getAuthToken = () => authToken;

// Helper para fazer requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      throw new Error('Sessão expirada. Faça login novamente.');
    }
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || `Erro ${response.status}`);
  }

  return response.json();
}

// API de Autenticação
export const authAPI = {
  login: async (email: string, senha: string): Promise<LoginResponse> => {
    const response = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
    setAuthToken(response.token);
    return response;
  },

  logout: () => {
    clearAuthToken();
  },
};

// API de Clientes
export const clientesAPI = {
  listar: () => apiRequest<ClienteDTO[]>('/clientes'),
  
  buscar: (id: string) => apiRequest<ClienteDTO>(`/clientes/${id}`),
  
  criar: (cliente: ClienteDTO) =>
    apiRequest<ClienteDTO>('/clientes', {
      method: 'POST',
      body: JSON.stringify(cliente),
    }),
  
  atualizar: (id: string, cliente: Partial<ClienteDTO>) =>
    apiRequest<ClienteDTO>(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cliente),
    }),
  
  deletar: (id: string) =>
    apiRequest<void>(`/clientes/${id}`, {
      method: 'DELETE',
    }),
};

// API de Cardápio
export const cardapioAPI = {
  listar: (ativo?: boolean) => {
    const query = ativo !== undefined ? `?ativo=${ativo}` : '';
    return apiRequest<CardapioItemDTO[]>(`/cardapio${query}`);
  },
  
  buscar: (id: string) => apiRequest<CardapioItemDTO>(`/cardapio/${id}`),
  
  criar: (item: CardapioItemDTO) =>
    apiRequest<CardapioItemDTO>('/cardapio', {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  
  atualizar: (id: string, item: Partial<CardapioItemDTO>) =>
    apiRequest<CardapioItemDTO>(`/cardapio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    }),
  
  ativarDesativar: (id: string, ativo: boolean) =>
    apiRequest<CardapioItemDTO>(`/cardapio/${id}/ativo`, {
      method: 'PATCH',
      body: JSON.stringify({ ativo }),
    }),
  
  getWhatsAppText: () => apiRequest<{ texto: string }>('/cardapio/whatsapp-text'),
};

// API de Pedidos
export const pedidosAPI = {
  listar: (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return apiRequest<PedidoDTO[]>(`/pedidos${query}`);
  },
  
  buscar: (id: string) => apiRequest<PedidoDTO>(`/pedidos/${id}`),
  
  criar: (pedido: PedidoDTO) =>
    apiRequest<PedidoDTO>('/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedido),
    }),
  
  atualizarStatus: (id: string, status: string) =>
    apiRequest<PedidoDTO>(`/pedidos/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  
  deletar: (id: string) =>
    apiRequest<void>(`/pedidos/${id}`, {
      method: 'DELETE',
    }),
  
  kanban: () => apiRequest<Record<string, PedidoDTO[]>>('/pedidos/kanban'),
};

// Health Check
export const healthAPI = {
  check: () => apiRequest<{ status: string }>('/actuator/health'),
};

