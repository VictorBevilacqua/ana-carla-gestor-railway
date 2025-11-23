import { useState, useEffect } from "react";
import { pedidosAPI, PedidoDTO, PedidoItemDTO, clientesAPI, ClienteDTO, cardapioAPI, CardapioItemDTO } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Package, Clock, Check, Truck, Plus, X, Minus, Eye, ShoppingCart, User, CreditCard, FileText, Edit, Trash2, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type StatusPedido = "RECEBIDO" | "PREPARANDO" | "PRONTO" | "ENTREGUE";

const statusColumns: StatusPedido[] = ["RECEBIDO", "PREPARANDO", "PRONTO", "ENTREGUE"];
const statusLabels: Record<StatusPedido, string> = {
  RECEBIDO: "Novo",
  PREPARANDO: "Em preparo",
  PRONTO: "Pronto",
  ENTREGUE: "Entregue",
};

const statusConfig = {
  RECEBIDO: { color: "bg-info/10 text-info border-info/20", icon: Package },
  PREPARANDO: { color: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  PRONTO: { color: "bg-success/10 text-success border-success/20", icon: Check },
  ENTREGUE: { color: "bg-muted text-muted-foreground border-muted", icon: Truck },
};

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [cardapio, setCardapio] = useState<CardapioItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [dialogNovoOpen, setDialogNovoOpen] = useState(false);
  const [dialogEditarOpen, setDialogEditarOpen] = useState(false);
  const [dialogDetalhesOpen, setDialogDetalhesOpen] = useState(false);
  const [alertExcluirOpen, setAlertExcluirOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoDTO | null>(null);
  
  const [novoClienteId, setNovoClienteId] = useState("");
  const [novoCanal, setNovoCanal] = useState("PRESENCIAL");
  const [novasObservacoes, setNovasObservacoes] = useState("");
  const [itensSelecionados, setItensSelecionados] = useState<Map<string, number>>(new Map());
  const [salvando, setSalvando] = useState(false);

  const [editarClienteId, setEditarClienteId] = useState("");
  const [editarCanal, setEditarCanal] = useState("PRESENCIAL");
  const [editarObservacoes, setEditarObservacoes] = useState("");
  const [editarItensSelecionados, setEditarItensSelecionados] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      console.log("=== CARREGANDO DADOS ===");
      const [pedidosData, clientesData, cardapioData] = await Promise.all([
        pedidosAPI.listar(),
        clientesAPI.listar(),
        cardapioAPI.listar(), // carregar TODOS os itens (incluindo inativos) para poder editar pedidos antigos
      ]);
      console.log(`Pedidos carregados: ${pedidosData.length}`);
      console.log(`Clientes carregados: ${clientesData.length}`);
      console.log(`Cardápio carregado: ${cardapioData.length} itens`);
      console.log(`Itens ativos: ${cardapioData.filter(i => i.ativo).length}`);
      console.log(`Itens inativos: ${cardapioData.filter(i => !i.ativo).length}`);
      
      // Filtrar pedidos cancelados (finalizados) para não mostrá-los no Kanban
      const pedidosAtivos = pedidosData.filter(p => p.status !== "CANCELADO");
      console.log(`Pedidos ativos (sem cancelados): ${pedidosAtivos.length}`);
      
      setPedidos(pedidosAtivos);
      setClientes(clientesData);
      setCardapio(cardapioData);
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
      toast.error(`Erro ao carregar dados: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const adicionarItem = (itemId: string) => {
    const novoMapa = new Map(itensSelecionados);
    const qtdAtual = novoMapa.get(itemId) || 0;
    novoMapa.set(itemId, qtdAtual + 1);
    setItensSelecionados(novoMapa);
  };

  const removerItem = (itemId: string) => {
    const novoMapa = new Map(itensSelecionados);
    const qtdAtual = novoMapa.get(itemId) || 0;
    if (qtdAtual > 1) {
      novoMapa.set(itemId, qtdAtual - 1);
    } else {
      novoMapa.delete(itemId);
    }
    setItensSelecionados(novoMapa);
  };

  const adicionarItemEditar = (itemId: string) => {
    const novoMapa = new Map(editarItensSelecionados);
    const qtdAtual = novoMapa.get(itemId) || 0;
    novoMapa.set(itemId, qtdAtual + 1);
    setEditarItensSelecionados(novoMapa);
  };

  const removerItemEditar = (itemId: string) => {
    const novoMapa = new Map(editarItensSelecionados);
    const qtdAtual = novoMapa.get(itemId) || 0;
    if (qtdAtual > 1) {
      novoMapa.set(itemId, qtdAtual - 1);
    } else {
      novoMapa.delete(itemId);
    }
    setEditarItensSelecionados(novoMapa);
  };

  const calcularTotal = () => {
    let total = 0;
    itensSelecionados.forEach((qtd, itemId) => {
      const item = cardapio.find((i) => i.id === itemId);
      if (item) {
        total += item.preco * qtd;
      }
    });
    return total;
  };

  const calcularTotalEditar = () => {
    let total = 0;
    editarItensSelecionados.forEach((qtd, itemId) => {
      const item = cardapio.find((i) => i.id === itemId);
      if (item) {
        total += item.preco * qtd;
      }
    });
    return total;
  };

  const criarNovoPedido = async () => {
    if (!novoClienteId) {
      toast.error("Selecione um cliente");
      return;
    }

    if (itensSelecionados.size === 0) {
      toast.error("Adicione pelo menos um item ao pedido");
      return;
    }

    try {
      setSalvando(true);
      const itens: PedidoItemDTO[] = [];
      itensSelecionados.forEach((qtd, itemId) => {
        const itemCardapio = cardapio.find((i) => i.id === itemId);
        if (itemCardapio) {
          itens.push({
            nome: itemCardapio.nome,
            quantidade: qtd,
            precoUnit: itemCardapio.preco,
          });
        }
      });

      const total = calcularTotal();

      const novoPedido = await pedidosAPI.criar({
        clienteId: novoClienteId,
        valorTotal: total,
        status: "RECEBIDO",
        canal: novoCanal,
        observacoes: novasObservacoes || undefined,
        itens: itens,
      });

      setPedidos([...pedidos, novoPedido]);
      setDialogNovoOpen(false);
      setNovoClienteId("");
      setNovoCanal("PRESENCIAL");
      setNovasObservacoes("");
      setItensSelecionados(new Map());
      toast.success("Pedido criado e salvo no banco!");
    } catch (error: any) {
      toast.error(`Erro ao criar pedido: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const novoStatus = destination.droppableId as StatusPedido;
    const pedidoId = draggableId;

    try {
      await pedidosAPI.atualizarStatus(pedidoId, novoStatus);
      setPedidos(pedidos.map(p => p.id === pedidoId ? { ...p, status: novoStatus } : p));
      toast.success(`Pedido movido para: ${statusLabels[novoStatus]}`);
    } catch (error: any) {
      toast.error(`Erro ao atualizar status: ${error.message}`);
    }
  };

  const abrirDetalhes = (pedido: PedidoDTO) => {
    setPedidoSelecionado(pedido);
    setDialogDetalhesOpen(true);
  };

  const abrirEditar = (pedido: PedidoDTO) => {
    setPedidoSelecionado(pedido);
    setEditarClienteId(pedido.clienteId);
    setEditarCanal(pedido.canal);
    setEditarObservacoes(pedido.observacoes || "");
    
    const novoMapa = new Map<string, number>();
    pedido.itens?.forEach((item) => {
      const cardapioItem = cardapio.find(c => c.nome === item.nome);
      if (cardapioItem) {
        novoMapa.set(cardapioItem.id!, item.quantidade);
      }
    });
    setEditarItensSelecionados(novoMapa);
    setDialogEditarOpen(true);
  };

  const salvarEdicao = async () => {
    if (!pedidoSelecionado || !pedidoSelecionado.id) return;
    if (!editarClienteId) {
      toast.error("Selecione um cliente");
      return;
    }
    if (editarItensSelecionados.size === 0) {
      toast.error("Adicione pelo menos um item ao pedido");
      return;
    }

    try {
      setSalvando(true);
      const itens: PedidoItemDTO[] = [];
      editarItensSelecionados.forEach((qtd, itemId) => {
        const itemCardapio = cardapio.find((i) => i.id === itemId);
        if (itemCardapio) {
          itens.push({
            nome: itemCardapio.nome,
            quantidade: qtd,
            precoUnit: itemCardapio.preco,
          });
        }
      });

      const total = calcularTotalEditar();

      const pedidoAtualizado = await pedidosAPI.atualizar(pedidoSelecionado.id, {
        clienteId: editarClienteId,
        valorTotal: total,
        status: pedidoSelecionado.status,
        canal: editarCanal,
        observacoes: editarObservacoes || undefined,
        itens: itens,
      });

      setPedidos(pedidos.map(p => p.id === pedidoSelecionado.id ? pedidoAtualizado : p));
      setDialogEditarOpen(false);
      toast.success("Pedido atualizado no banco!");
    } catch (error: any) {
      toast.error(`Erro ao atualizar pedido: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const confirmarFinalizar = (pedido: PedidoDTO) => {
    setPedidoSelecionado(pedido);
    setAlertExcluirOpen(true);
  };

  const finalizarPedido = async () => {
    if (!pedidoSelecionado || !pedidoSelecionado.id) {
      toast.error("Nenhum pedido selecionado");
      return;
    }

    const idParaFinalizar = pedidoSelecionado.id;
    console.log("=== FINALIZANDO PEDIDO ===");
    console.log("ID:", idParaFinalizar);

    try {
      // Mudar status para CANCELADO (finalizado/arquivado)
      await pedidosAPI.atualizarStatus(idParaFinalizar, "CANCELADO");
      console.log("✅ Pedido finalizado (status → CANCELADO)");
      
      // Recarregar pedidos (pedidos cancelados serão filtrados)
      const pedidosAtualizados = await pedidosAPI.listar();
      // Filtrar pedidos cancelados para não mostrá-los no Kanban
      setPedidos(pedidosAtualizados.filter(p => p.status !== "CANCELADO"));
      
      setAlertExcluirOpen(false);
      setPedidoSelecionado(null);
      toast.success("Pedido finalizado! Foi movido para o histórico.");
    } catch (error: any) {
      console.error("❌ ERRO ao finalizar:", error);
      toast.error(`Erro ao finalizar pedido: ${error.message || "Erro desconhecido"}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getPedidosPorStatus = (status: StatusPedido) => {
    return pedidos.filter(p => p.status === status);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Pedidos</h1>
          <p className="text-muted-foreground">Gerencie seus pedidos em Kanban</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => {
              console.log("🔄 Recarregando dados...");
              carregarDados();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        <Dialog open={dialogNovoOpen} onOpenChange={setDialogNovoOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white shadow-custom-md">
                <Plus className="h-4 w-4 mr-2" />
                Novo Pedido
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Pedido</DialogTitle>
              <DialogDescription>
                Adicione um novo pedido ao sistema (será salvo no PostgreSQL)
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[500px] pr-4">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Cliente *</Label>
                  <Select value={novoClienteId} onValueChange={setNovoClienteId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id!}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Itens do Pedido *</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-2">
                    {cardapio.filter(item => item.ativo).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex-1">
                          <p className="font-medium">{item.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.preco)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removerItem(item.id!)}
                            disabled={!itensSelecionados.has(item.id!)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">
                            {itensSelecionados.get(item.id!) || 0}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => adicionarItem(item.id!)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Canal do Pedido</Label>
                  <Select value={novoCanal} onValueChange={setNovoCanal}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                      <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                      <SelectItem value="TELEFONE">Telefone</SelectItem>
                      <SelectItem value="WEB">Web</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea
                    placeholder="Observações do pedido..."
                    value={novasObservacoes}
                    onChange={(e) => setNovasObservacoes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(calcularTotal())}
                  </span>
                </div>
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDialogNovoOpen(false)} disabled={salvando}>
                Cancelar
              </Button>
              <Button onClick={criarNovoPedido} className="gradient-primary text-white" disabled={salvando}>
                {salvando ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</> : "Criar Pedido"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statusColumns.map((status) => {
            const config = statusConfig[status];
            const Icon = config.icon;
            const pedidosStatus = getPedidosPorStatus(status);

            return (
              <div key={status} className="flex flex-col">
                <div className={`p-4 rounded-t-lg border-b-2 ${config.color}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <h3 className="font-semibold">{statusLabels[status]}</h3>
                    </div>
                    <Badge variant="secondary">{pedidosStatus.length}</Badge>
                  </div>
                </div>

                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2 space-y-2 min-h-[200px] rounded-b-lg border-2 ${
                        snapshot.isDraggingOver ? "border-primary bg-primary/5" : "border-border bg-muted/20"
                      }`}
                    >
                      {pedidosStatus.map((pedido, index) => {
                        const cliente = clientes.find(c => c.id === pedido.clienteId);
                        return (
                          <Draggable key={pedido.id} draggableId={pedido.id!} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`shadow-custom-sm cursor-move ${
                                  snapshot.isDragging ? "shadow-custom-lg rotate-2" : ""
                                }`}
                              >
                                <CardHeader className="p-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium text-sm">{cliente?.nome || "Cliente"}</span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => abrirDetalhes(pedido)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-3 pt-0 space-y-2">
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <ShoppingCart className="h-3 w-3" />
                                    <span>{pedido.itens?.length || 0} itens</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <CreditCard className="h-3 w-3" />
                                    <span>{pedido.canal}</span>
                                  </div>
                                  <div className="flex items-center justify-between pt-2 border-t">
                                    <span className="text-lg font-bold text-primary">
                                      {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                      }).format(pedido.valorTotal)}
                                    </span>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => abrirEditar(pedido)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      {status === "ENTREGUE" && (
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="h-7 w-7 text-success"
                                          onClick={() => confirmarFinalizar(pedido)}
                                          title="Finalizar pedido (mover para histórico)"
                                        >
                                          <Check className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Dialog Detalhes */}
      <Dialog open={dialogDetalhesOpen} onOpenChange={setDialogDetalhesOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {pedidoSelecionado && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes do Pedido</DialogTitle>
                <DialogDescription>
                  Pedido #{pedidoSelecionado.id?.substring(0, 8)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cliente</Label>
                    <p className="font-medium">{clientes.find(c => c.id === pedidoSelecionado.clienteId)?.nome}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={statusConfig[pedidoSelecionado.status as StatusPedido].color}>
                      {statusLabels[pedidoSelecionado.status as StatusPedido]}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>Itens</Label>
                  <div className="space-y-2 mt-2">
                    {pedidoSelecionado.itens?.map((item, idx) => (
                      <div key={idx} className="flex justify-between p-2 bg-muted/30 rounded">
                        <span>{item.quantidade}x {item.nome}</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(item.precoUnit * item.quantidade)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Pagamento</Label>
                    <p className="font-medium">{pedidoSelecionado.canal}</p>
                  </div>
                  <div>
                    <Label>Total</Label>
                    <p className="text-2xl font-bold text-primary">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(pedidoSelecionado.valorTotal)}
                    </p>
                  </div>
                </div>

                {pedidoSelecionado.observacoes && (
                  <div>
                    <Label>Observações</Label>
                    <p className="text-sm text-muted-foreground mt-1">{pedidoSelecionado.observacoes}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogDetalhesOpen(false)}>
                  Fechar
                </Button>
                <Button onClick={() => { setDialogDetalhesOpen(false); abrirEditar(pedidoSelecionado); }}>
                  Editar Pedido
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Editar - Similar ao Novo, mas com dados preenchidos */}
      <Dialog open={dialogEditarOpen} onOpenChange={setDialogEditarOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Pedido</DialogTitle>
            <DialogDescription>
              Altere as informações do pedido (será salvo no PostgreSQL)
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[500px] pr-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Select value={editarClienteId} onValueChange={setEditarClienteId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id!}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Itens do Pedido *</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-2">
                  {cardapio.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex-1">
                        <p className="font-medium">{item.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(item.preco)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removerItemEditar(item.id!)}
                          disabled={!editarItensSelecionados.has(item.id!)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">
                          {editarItensSelecionados.get(item.id!) || 0}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => adicionarItemEditar(item.id!)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Canal do Pedido</Label>
                <Select value={editarCanal} onValueChange={setEditarCanal}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                    <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                    <SelectItem value="TELEFONE">Telefone</SelectItem>
                    <SelectItem value="WEB">Web</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  placeholder="Observações do pedido..."
                  value={editarObservacoes}
                  onChange={(e) => setEditarObservacoes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="font-medium">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(calcularTotalEditar())}
                </span>
              </div>
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogEditarOpen(false)} disabled={salvando}>
              Cancelar
            </Button>
            <Button onClick={salvarEdicao} className="gradient-primary text-white" disabled={salvando}>
              {salvando ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</> : "Salvar Alterações"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Finalizar */}
      <AlertDialog open={alertExcluirOpen} onOpenChange={setAlertExcluirOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar Pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              O pedido será marcado como finalizado e movido para o histórico. Ele não será excluído do banco de dados, apenas não aparecerá mais no Kanban.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={finalizarPedido} className="bg-success text-white">
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
