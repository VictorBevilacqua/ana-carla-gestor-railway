// Data Store & Types for Mini-ERP
// TODO: integrate with API/backend in the future

export type StatusPedido = "Novo" | "Em preparo" | "Pronto" | "Entregue";
export type FormaPagamento = "PIX" | "Dinheiro" | "Cartão";
export type Categoria = "Salada" | "Proteína" | "Acompanhamento" | "Bebida" | "Bowl";

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  endereco?: string;
  observacoes?: string;
  dataCriacao: Date;
  dataUltimoPedido?: Date;
}

export interface ItemPedido {
  itemId: string;
  nomeItem: string;
  qtd: number;
  precoUnit: number;
}

export interface Pedido {
  id: string;
  clienteId: string;
  itens: ItemPedido[];
  total: number;
  formaPagamento: FormaPagamento;
  status: StatusPedido;
  pago: boolean;
  observacoes?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface ItemCardapio {
  id: string;
  nome: string;
  categoria: Categoria;
  preco: number;
  ativo: boolean;
  descricao?: string;
}

// Mock Data Seeds
export const clientesSeed: Cliente[] = [
  {
    id: "c1",
    nome: "Marina Souza",
    telefone: "(19) 98765-4321",
    email: "marina@email.com",
    dataCriacao: new Date(2025, 8, 15),
    dataUltimoPedido: new Date(2025, 9, 8),
  },
  {
    id: "c2",
    nome: "Rodrigo Silva",
    telefone: "(19) 98765-4322",
    dataCriacao: new Date(2025, 8, 20),
    dataUltimoPedido: new Date(2025, 9, 9),
  },
  {
    id: "c3",
    nome: "Juliana Costa",
    telefone: "(19) 98765-4323",
    email: "juliana@email.com",
    dataCriacao: new Date(2025, 8, 22),
    dataUltimoPedido: new Date(2025, 9, 5),
  },
  {
    id: "c4",
    nome: "Victor Bevilacqua",
    telefone: "(19) 98765-4324",
    dataCriacao: new Date(2025, 7, 10),
    dataUltimoPedido: new Date(2025, 8, 5),
    observacoes: "Cliente VIP",
  },
  {
    id: "c5",
    nome: "Carla Mendes",
    telefone: "(19) 98765-4325",
    dataCriacao: new Date(2025, 8, 1),
    dataUltimoPedido: new Date(2025, 9, 7),
  },
];

export const cardapioSeed: ItemCardapio[] = [
  {
    id: "item1",
    nome: "Salada Caesar",
    categoria: "Salada",
    preco: 22.0,
    ativo: true,
    descricao: "Alface, frango, croutons e molho caesar",
  },
  {
    id: "item2",
    nome: "Frango Grelhado",
    categoria: "Proteína",
    preco: 28.0,
    ativo: true,
    descricao: "Filé de frango grelhado com temperos",
  },
  {
    id: "item3",
    nome: "Cuscuz Marroquino",
    categoria: "Acompanhamento",
    preco: 20.0,
    ativo: true,
    descricao: "Cuscuz com legumes",
  },
  {
    id: "item4",
    nome: "Suco Detox",
    categoria: "Bebida",
    preco: 12.0,
    ativo: true,
    descricao: "Suco verde detox",
  },
  {
    id: "item5",
    nome: "Salada no Pote",
    categoria: "Salada",
    preco: 18.0,
    ativo: true,
    descricao: "Mix de folhas e vegetais",
  },
  {
    id: "item6",
    nome: "Bowl Low-Carb",
    categoria: "Bowl",
    preco: 26.0,
    ativo: true,
    descricao: "Bowl com proteína e vegetais",
  },
];

const now = new Date();
const hoje = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const ontem = new Date(hoje);
ontem.setDate(ontem.getDate() - 1);
const doisDiasAtras = new Date(hoje);
doisDiasAtras.setDate(doisDiasAtras.getDate() - 2);

export const pedidosSeed: Pedido[] = [
  {
    id: "p1",
    clienteId: "c1",
    itens: [
      { itemId: "item1", nomeItem: "Salada Caesar", qtd: 2, precoUnit: 22.0 },
      { itemId: "item4", nomeItem: "Suco Detox", qtd: 1, precoUnit: 12.0 },
    ],
    total: 56.0,
    formaPagamento: "PIX",
    status: "Novo",
    pago: false,
    dataCriacao: hoje,
    dataAtualizacao: hoje,
  },
  {
    id: "p2",
    clienteId: "c2",
    itens: [
      { itemId: "item2", nomeItem: "Frango Grelhado", qtd: 1, precoUnit: 28.0 },
      { itemId: "item3", nomeItem: "Cuscuz Marroquino", qtd: 1, precoUnit: 20.0 },
    ],
    total: 48.0,
    formaPagamento: "Cartão",
    status: "Novo",
    pago: true,
    dataCriacao: hoje,
    dataAtualizacao: hoje,
  },
  {
    id: "p3",
    clienteId: "c3",
    itens: [
      { itemId: "item6", nomeItem: "Bowl Low-Carb", qtd: 3, precoUnit: 26.0 },
    ],
    total: 78.0,
    formaPagamento: "Dinheiro",
    status: "Em preparo",
    pago: false,
    observacoes: "Sem cebola",
    dataCriacao: hoje,
    dataAtualizacao: hoje,
  },
  {
    id: "p4",
    clienteId: "c5",
    itens: [
      { itemId: "item5", nomeItem: "Salada no Pote", qtd: 2, precoUnit: 18.0 },
      { itemId: "item4", nomeItem: "Suco Detox", qtd: 2, precoUnit: 12.0 },
    ],
    total: 60.0,
    formaPagamento: "PIX",
    status: "Em preparo",
    pago: true,
    dataCriacao: ontem,
    dataAtualizacao: hoje,
  },
  {
    id: "p5",
    clienteId: "c1",
    itens: [
      { itemId: "item2", nomeItem: "Frango Grelhado", qtd: 2, precoUnit: 28.0 },
    ],
    total: 56.0,
    formaPagamento: "PIX",
    status: "Pronto",
    pago: true,
    dataCriacao: ontem,
    dataAtualizacao: hoje,
  },
  {
    id: "p6",
    clienteId: "c2",
    itens: [
      { itemId: "item1", nomeItem: "Salada Caesar", qtd: 1, precoUnit: 22.0 },
    ],
    total: 22.0,
    formaPagamento: "Dinheiro",
    status: "Pronto",
    pago: false,
    dataCriacao: ontem,
    dataAtualizacao: ontem,
  },
  {
    id: "p7",
    clienteId: "c4",
    itens: [
      { itemId: "item6", nomeItem: "Bowl Low-Carb", qtd: 1, precoUnit: 26.0 },
      { itemId: "item4", nomeItem: "Suco Detox", qtd: 1, precoUnit: 12.0 },
    ],
    total: 38.0,
    formaPagamento: "Cartão",
    status: "Entregue",
    pago: true,
    dataCriacao: doisDiasAtras,
    dataAtualizacao: ontem,
  },
  {
    id: "p8",
    clienteId: "c3",
    itens: [
      { itemId: "item5", nomeItem: "Salada no Pote", qtd: 4, precoUnit: 18.0 },
    ],
    total: 72.0,
    formaPagamento: "PIX",
    status: "Entregue",
    pago: true,
    dataCriacao: doisDiasAtras,
    dataAtualizacao: doisDiasAtras,
  },
];

// In-memory store
class DataStore {
  private _clientes: Cliente[] = [...clientesSeed];
  private _cardapio: ItemCardapio[] = [...cardapioSeed];
  private _pedidos: Pedido[] = [...pedidosSeed];

  // Clientes
  get clientes() {
    return this._clientes;
  }
  addCliente(cliente: Cliente) {
    this._clientes.push(cliente);
  }
  updateCliente(id: string, updates: Partial<Cliente>) {
    const index = this._clientes.findIndex((c) => c.id === id);
    if (index !== -1) {
      this._clientes[index] = { ...this._clientes[index], ...updates };
    }
  }
  deleteCliente(id: string) {
    this._clientes = this._clientes.filter((c) => c.id !== id);
  }

  // Cardápio
  get cardapio() {
    return this._cardapio;
  }
  addItemCardapio(item: ItemCardapio) {
    this._cardapio.push(item);
  }
  updateItemCardapio(id: string, updates: Partial<ItemCardapio>) {
    const index = this._cardapio.findIndex((i) => i.id === id);
    if (index !== -1) {
      this._cardapio[index] = { ...this._cardapio[index], ...updates };
    }
  }

  // Pedidos
  get pedidos() {
    return this._pedidos;
  }
  addPedido(pedido: Pedido) {
    this._pedidos.push(pedido);
  }
  updatePedido(id: string, updates: Partial<Pedido>) {
    const index = this._pedidos.findIndex((p) => p.id === id);
    if (index !== -1) {
      this._pedidos[index] = { 
        ...this._pedidos[index], 
        ...updates,
        dataAtualizacao: new Date(),
      };
    }
  }
  deletePedido(id: string) {
    this._pedidos = this._pedidos.filter((p) => p.id !== id);
  }

  // Reseed (reset to initial state)
  reseed() {
    this._clientes = [...clientesSeed];
    this._cardapio = [...cardapioSeed];
    this._pedidos = [...pedidosSeed];
  }
}

export const dataStore = new DataStore();
