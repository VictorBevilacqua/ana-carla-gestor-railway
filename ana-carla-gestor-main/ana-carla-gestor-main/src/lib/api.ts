// API Client para conectar com o backend Spring Boot

// 1) Usa VITE_API_URL se existir; senão, cai pro domínio do Railway.
// 2) Remove eventuais barras no final para evitar // nas URLs.
// src/lib/api.ts
// api.ts

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV
    ? 'http://localhost:8080'          // quando você estiver rodando o back local
    : 'https://anacarlabackend.up.railway.app'); // fallback em produção




// Tipos mapeados do backend
export interface ClienteDTO {
  id?: string;
  nome: string;
  telefones?: string;
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
  nome: string;
  quantidade: number;
  precoUnit: number;
  observacoes?: string;
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
let authToken: string | null = localStorage.getItem("auth_token");

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem("auth_token", token);
};

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem("auth_token");
};

export const getAuthToken = () => authToken;

// Helper para fazer requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Verificar se a resposta é HTML (erro do servidor)
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      let errorMessage = `Erro ${response.status}`;
      if (isJson) {
        try {
          const error = await response.json();
          console.error("Erro do servidor:", error);
          if (error.errors && Array.isArray(error.errors)) {
            errorMessage = error.errors.join(", ");
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.error) {
            errorMessage = error.error;
          } else if (error.detail) {
            errorMessage = error.detail;
          } else {
            errorMessage = JSON.stringify(error);
          }
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
      } else {
        const text = await response.text();
        console.error("Resposta não-JSON recebida:", text.substring(0, 500));
        errorMessage = `Erro do servidor: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return undefined as any;
    }

    if (!isJson) {
      const text = await response.text();
      console.error("Resposta não-JSON recebida:", text.substring(0, 200));
      throw new Error(
        `Resposta inválida do servidor: esperado JSON, recebido ${contentType}`
      );
    }

    return response.json();
  } catch (error: any) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error?.message || "Erro desconhecido");
  }
}

// API de Autenticação
export const authAPI = {
  login: async (email: string, senha: string): Promise<LoginResponse> => {
    const response = await apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
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
  listar: () => apiRequest<ClienteDTO[]>("/clientes"),

  buscar: (id: string) => apiRequest<ClienteDTO>(`/clientes/${id}`),

  criar: (cliente: ClienteDTO) =>
    apiRequest<ClienteDTO>("/clientes", {
      method: "POST",
      body: JSON.stringify(cliente),
    }),

  atualizar: (id: string, cliente: Partial<ClienteDTO>) =>
    apiRequest<ClienteDTO>(`/clientes/${id}`, {
      method: "PUT",
      body: JSON.stringify(cliente),
    }),

  deletar: (id: string) =>
    apiRequest<void>(`/clientes/${id}`, {
      method: "DELETE",
    }),
};

// API de Cardápio
export const cardapioAPI = {
  listar: (ativo?: boolean) => {
    const query = ativo !== undefined ? `?ativo=${ativo}` : "";
    return apiRequest<CardapioItemDTO[]>(`/cardapio${query}`);
  },

  buscar: (id: string) => apiRequest<CardapioItemDTO>(`/cardapio/${id}`),

  criar: (item: CardapioItemDTO) =>
    apiRequest<CardapioItemDTO>("/cardapio", {
      method: "POST",
      body: JSON.stringify(item),
    }),

  atualizar: (id: string, item: Partial<CardapioItemDTO>) =>
    apiRequest<CardapioItemDTO>(`/cardapio/${id}`, {
      method: "PUT",
      body: JSON.stringify(item),
    }),

  ativarDesativar: (id: string, ativo: boolean) =>
    apiRequest<CardapioItemDTO>(`/cardapio/${id}/ativo`, {
      method: "PATCH",
      body: JSON.stringify({ ativo }),
    }),

  getWhatsAppText: () =>
    apiRequest<{ texto: string }>("/cardapio/whatsapp-text"),
};

// API de Pedidos
export const pedidosAPI = {
  listar: (status?: string) => {
    const query = status ? `?status=${status}` : "";
    return apiRequest<PedidoDTO[]>(`/pedidos${query}`);
  },

  buscar: (id: string) => apiRequest<PedidoDTO>(`/pedidos/${id}`),

  criar: (pedido: PedidoDTO) =>
    apiRequest<PedidoDTO>("/pedidos", {
      method: "POST",
      body: JSON.stringify(pedido),
    }),

  atualizar: (id: string, pedido: Partial<PedidoDTO>) =>
    apiRequest<PedidoDTO>(`/pedidos/${id}`, {
      method: "PUT",
      body: JSON.stringify(pedido),
    }),

  atualizarStatus: (id: string, status: string) =>
    apiRequest<PedidoDTO>(`/pedidos/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  deletar: (id: string) =>
    apiRequest<void>(`/pedidos/${id}`, {
      method: "DELETE",
    }),

  kanban: () => apiRequest<Record<string, PedidoDTO[]>>("/pedidos/kanban"),
};

// Health Check
export const healthAPI = {
  check: () => apiRequest<{ status: string }>("/actuator/health"),
};
