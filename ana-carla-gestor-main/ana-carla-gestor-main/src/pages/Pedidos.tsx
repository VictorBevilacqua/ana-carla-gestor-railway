import { useState } from "react";
import { dataStore, Pedido, StatusPedido, ItemPedido } from "@/lib/dataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Package, Clock, Check, Truck, Plus, X, Minus, Eye, ShoppingCart, User, CreditCard, FileText } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const statusColumns: StatusPedido[] = ["Novo", "Em preparo", "Pronto", "Entregue"];

const statusConfig = {
  Novo: { color: "bg-info/10 text-info border-info/20", icon: Package },
  "Em preparo": { color: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  Pronto: { color: "bg-success/10 text-success border-success/20", icon: Check },
  Entregue: { color: "bg-muted text-muted-foreground border-muted", icon: Truck },
};

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>(dataStore.pedidos);
  const [dialogNovoOpen, setDialogNovoOpen] = useState(false);
  const [dialogDetalhesOpen, setDialogDetalhesOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  
  const [novoClienteId, setNovoClienteId] = useState("");
  const [novaFormaPagamento, setNovaFormaPagamento] = useState("Dinheiro");
  const [novasObservacoes, setNovasObservacoes] = useState("");
  const [itensSelecionados, setItensSelecionados] = useState<Map<string, number>>(new Map());

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

  const calcularTotal = () => {
    let total = 0;
    itensSelecionados.forEach((qtd, itemId) => {
      const item = dataStore.cardapio.find((i) => i.id === itemId);
      if (item) {
        total += item.preco * qtd;
      }
    });
    return total;
  };

  const criarNovoPedido = () => {
    if (!novoClienteId) {
      toast.error("Selecione um cliente");
      return;
    }

    if (itensSelecionados.size === 0) {
      toast.error("Adicione pelo menos um item ao pedido");
      return;
    }

    const itens: ItemPedido[] = [];
    itensSelecionados.forEach((qtd, itemId) => {
      const itemCardapio = dataStore.cardapio.find((i) => i.id === itemId);
      if (itemCardapio) {
        itens.push({
          itemCardapioId: itemId,
          nome: itemCardapio.nome,
          qtd: qtd,
          precoUnitario: itemCardapio.preco,
          subtotal: itemCardapio.preco * qtd,
        });
      }
    });

    const total = calcularTotal();

    const novoPedido: Pedido = {
      id: Math.random().toString(36).substring(7),
      clienteId: novoClienteId,
      status: "Novo",
      itens: itens,
      total: total,
      pago: false,
      formaPagamento: novaFormaPagamento,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      observacoes: novasObservacoes,
    };

    dataStore.pedidos.push(novoPedido);
    setPedidos([...dataStore.pedidos]);
    setDialogNovoOpen(false);
    setNovoClienteId("");
    setNovasObservacoes("");
    setItensSelecionados(new Map());
    toast.success("Pedido criado com sucesso!");
  };

  const abrirDetalhes = (pedido: Pedido) => {
    setPedidoSelecionado(pedido);
    setDialogDetalhesOpen(true);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceStatus = result.source.droppableId as StatusPedido;
    const destStatus = result.destination.droppableId as StatusPedido;
    
    if (sourceStatus === destStatus) return;

    const pedidoId = result.draggableId;
    
    dataStore.updatePedido(pedidoId, { status: destStatus });
    setPedidos([...dataStore.pedidos]);
    
    toast.success(`Pedido movido para ${destStatus}`);
  };

  const getPedidosByStatus = (status: StatusPedido) => {
    return pedidos.filter((p) => p.status === status);
  };

  const getClienteNome = (clienteId: string) => {
    return dataStore.clientes.find((c) => c.id === clienteId)?.nome || "Cliente desconhecido";
  };

  const getTotalItens = (pedido: Pedido) => {
    return pedido.itens.reduce((acc, item) => acc + item.qtd, 0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Pedidos</h1>
        <p className="text-muted-foreground">Kanban de acompanhamento</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statusColumns.map((status) => {
            const pedidosDoStatus = getPedidosByStatus(status);
            const config = statusConfig[status];
            const Icon = config.icon;

            return (
              <div key={status} className="space-y-3">
                <div className="flex items-center gap-2 px-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{status}</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {pedidosDoStatus.length}
                  </Badge>
                </div>

                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[200px] space-y-3 p-3 rounded-2xl transition-colors ${
                        snapshot.isDraggingOver ? "bg-primary/5 border-2 border-primary/20" : "bg-muted/20"
                      }`}
                    >
                      {pedidosDoStatus.map((pedido, index) => (
                        <Draggable key={pedido.id} draggableId={pedido.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`shadow-custom-md border-0 cursor-grab active:cursor-grabbing transition-all ${
                                snapshot.isDragging ? "rotate-2 scale-105 shadow-custom-xl" : ""
                              }`}
                            >
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center justify-between">
                                  <span className="truncate">{getClienteNome(pedido.clienteId)}</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">{getTotalItens(pedido)} itens</span>
                                  <span className="font-semibold text-foreground">
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(pedido.total)}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant={pedido.pago ? "default" : "outline"} className="text-xs">
                                    {pedido.pago ? "Pago" : "Não pago"}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {pedido.formaPagamento}
                                  </Badge>
                                </div>

                                <div className="text-xs text-muted-foreground">
                                  {format(pedido.dataCriacao, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </div>

                                {pedido.observacoes && (
                                  <p className="text-xs text-muted-foreground italic truncate">
                                    {pedido.observacoes}
                                  </p>
                                )}

                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full mt-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    abrirDetalhes(pedido);
                                  }}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ver Detalhes
                                </Button>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Dialog de Detalhes do Pedido */}
      <Dialog open={dialogDetalhesOpen} onOpenChange={setDialogDetalhesOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {pedidoSelecionado && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  Detalhes do Pedido
                </DialogTitle>
                <DialogDescription>
                  Pedido #{pedidoSelecionado.id.substring(0, 8).toUpperCase()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Informações do Cliente */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User className="h-4 w-4" />
                    Cliente
                  </div>
                  <Card className="border-2">
                    <CardContent className="p-4">
                      <p className="font-semibold text-lg">{getClienteNome(pedidoSelecionado.clienteId)}</p>
                      <p className="text-sm text-muted-foreground">
                        {dataStore.clientes.find((c) => c.id === pedidoSelecionado.clienteId)?.telefone}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Itens do Pedido */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <ShoppingCart className="h-4 w-4" />
                    Itens do Pedido
                  </div>
                  <Card className="border-2">
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {pedidoSelecionado.itens.map((item, index) => (
                          <div key={index} className="p-4 flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium">{item.nome}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.qtd}x {new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(item.precoUnitario)}
                              </p>
                            </div>
                            <p className="font-semibold text-lg">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(item.subtotal)}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-muted/30 border-t-2 flex items-center justify-between">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-bold text-2xl text-primary">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(pedidoSelecionado.total)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Informações de Pagamento e Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      Pagamento
                    </div>
                    <div className="space-y-2">
                      <Badge variant={pedidoSelecionado.pago ? "default" : "outline"} className="text-sm">
                        {pedidoSelecionado.pago ? "✓ Pago" : "Pendente"}
                      </Badge>
                      <p className="text-sm font-medium">{pedidoSelecionado.formaPagamento}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Status
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {pedidoSelecionado.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Criado: {format(pedidoSelecionado.dataCriacao, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                {/* Observações */}
                {pedidoSelecionado.observacoes && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Observações
                    </div>
                    <Card className="border-2">
                      <CardContent className="p-4">
                        <p className="text-sm">{pedidoSelecionado.observacoes}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogDetalhesOpen(false)}>
                  Fechar
                </Button>
                <Button className="gradient-primary text-white">
                  Editar Pedido
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Card className="shadow-custom-md border-0">
        <CardHeader>
          <CardTitle className="text-foreground">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Dialog open={dialogNovoOpen} onOpenChange={setDialogNovoOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white shadow-custom-md hover:shadow-custom-lg transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Novo Pedido
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Criar Novo Pedido</DialogTitle>
                <DialogDescription>
                  Selecione o cliente e os itens do cardápio
                </DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-6 py-4">
                  {/* Cliente */}
                  <div className="space-y-2">
                    <Label htmlFor="cliente">Cliente *</Label>
                    <Select value={novoClienteId} onValueChange={setNovoClienteId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataStore.clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            {cliente.nome} - {cliente.telefone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Itens do Cardápio */}
                  <div className="space-y-2">
                    <Label>Itens do Pedido *</Label>
                    <Card className="border-2">
                      <CardContent className="p-4 space-y-3">
                        {dataStore.cardapio
                          .filter((item) => item.ativo)
                          .map((item) => {
                            const qtd = itensSelecionados.get(item.id) || 0;
                            return (
                              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex-1">
                                  <p className="font-medium">{item.nome}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(item.preco)}
                                  </p>
                                  <Badge variant="secondary" className="text-xs mt-1">
                                    {item.categoria}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  {qtd > 0 ? (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => removerItem(item.id)}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                      <span className="w-8 text-center font-semibold">{qtd}</span>
                                      <Button
                                        variant="default"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => adicionarItem(item.id)}
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => adicionarItem(item.id)}
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      Adicionar
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Resumo do Pedido */}
                  {itensSelecionados.size > 0 && (
                    <Card className="border-2 bg-primary/5">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Total de itens:</span>
                          <span className="font-semibold">
                            {Array.from(itensSelecionados.values()).reduce((a, b) => a + b, 0)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-lg">Total do Pedido:</span>
                          <span className="font-bold text-2xl text-primary">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(calcularTotal())}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Forma de Pagamento */}
                  <div className="space-y-2">
                    <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                    <Select value={novaFormaPagamento} onValueChange={setNovaFormaPagamento}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="Cartão">Cartão</SelectItem>
                        <SelectItem value="Transferência">Transferência</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Observações */}
                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Ex: Sem cebola, cliente prefere bem passado..."
                      value={novasObservacoes}
                      onChange={(e) => setNovasObservacoes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </ScrollArea>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => {
                  setDialogNovoOpen(false);
                  setItensSelecionados(new Map());
                }}>
                  Cancelar
                </Button>
                <Button onClick={criarNovoPedido} className="gradient-primary text-white">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Criar Pedido
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">Hoje</Button>
          <Button variant="outline">7 dias</Button>
          <Button variant="outline">30 dias</Button>
        </CardContent>
      </Card>
    </div>
  );
}
