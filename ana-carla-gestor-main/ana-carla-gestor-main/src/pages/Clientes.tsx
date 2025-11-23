import { useState, useMemo, useEffect } from "react";
import { clientesAPI, ClienteDTO, pedidosAPI, PedidoDTO } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Phone, Plus, Mail, Calendar, DollarSign, Loader2, Trash2, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Clientes() {
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [dialogNovoOpen, setDialogNovoOpen] = useState(false);
  const [dialogDetalhesOpen, setDialogDetalhesOpen] = useState(false);
  const [dialogEditarOpen, setDialogEditarOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteDTO | null>(null);
  
  const [novoNome, setNovoNome] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoEndereco, setNovoEndereco] = useState("");
  const [novasObservacoes, setNovasObservacoes] = useState("");
  
  const [editarNome, setEditarNome] = useState("");
  const [editarTelefone, setEditarTelefone] = useState("");
  const [editarEmail, setEditarEmail] = useState("");
  const [editarEndereco, setEditarEndereco] = useState("");
  const [editarObservacoes, setEditarObservacoes] = useState("");
  
  const [salvando, setSalvando] = useState(false);

  // Carregar clientes e pedidos da API
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [clientesData, pedidosData] = await Promise.all([
        clientesAPI.listar(),
        pedidosAPI.listar()
      ]);
      setClientes(clientesData);
      setPedidos(pedidosData);
    } catch (error: any) {
      toast.error(`Erro ao carregar dados: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const criarNovoCliente = async () => {
    if (!novoNome.trim()) {
      toast.error("Digite o nome do cliente");
      return;
    }
    if (!novoTelefone.trim()) {
      toast.error("Digite o telefone do cliente");
      return;
    }

    try {
      setSalvando(true);
      const novoCliente = await clientesAPI.criar({
        nome: novoNome,
        telefones: novoTelefone || undefined,
        email: novoEmail || undefined,
        endereco: novoEndereco || undefined,
        observacoes: novasObservacoes || undefined,
        ativo: true
      });

      setClientes([...clientes, novoCliente]);
      setDialogNovoOpen(false);
      setNovoNome("");
      setNovoTelefone("");
      setNovoEmail("");
      setNovoEndereco("");
      setNovasObservacoes("");
      toast.success("Cliente criado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao criar cliente: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const abrirDetalhes = (cliente: ClienteDTO) => {
    setClienteSelecionado(cliente);
    setDialogDetalhesOpen(true);
  };

  const abrirEditar = (cliente: ClienteDTO) => {
    setClienteSelecionado(cliente);
    setEditarNome(cliente.nome);
    setEditarTelefone(cliente.telefones || "");
    setEditarEmail(cliente.email || "");
    setEditarEndereco(cliente.endereco || "");
    setEditarObservacoes(cliente.observacoes || "");
    setDialogEditarOpen(true);
  };

  const salvarEdicao = async () => {
    if (!editarNome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    if (!clienteSelecionado) return;

    try {
      setSalvando(true);
      const clienteAtualizado = await clientesAPI.atualizar(clienteSelecionado.id!, {
        nome: editarNome,
        telefones: editarTelefone || undefined,
        email: editarEmail || undefined,
        endereco: editarEndereco || undefined,
        observacoes: editarObservacoes || undefined,
      });

      setClientes(clientes.map(c => c.id === clienteAtualizado.id ? clienteAtualizado : c));
      setDialogEditarOpen(false);
      toast.success("Cliente atualizado!");
    } catch (error: any) {
      toast.error(`Erro ao atualizar cliente: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const excluirCliente = async (cliente: ClienteDTO) => {
    if (!cliente.id) return;
    
    try {
      await clientesAPI.deletar(cliente.id);
      setClientes(clientes.filter(c => c.id !== cliente.id));
      setDialogDetalhesOpen(false);
      toast.success("Cliente excluído com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao excluir cliente: ${error.message}`);
    }
  };

  const clientesFiltrados = useMemo(() => {
    if (!busca) return clientes;
    const termo = busca.toLowerCase();
    return clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        (c.telefones && c.telefones.toLowerCase().includes(termo))
    );
  }, [clientes, busca]);

  const getTotalGasto30d = (clienteId: string) => {
    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje);
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

    const total = pedidos
      .filter(
        (p) => {
          if (p.clienteId !== clienteId) return false;
          if (!p.createdAt) return false;
          const dataPedido = parseISO(p.createdAt);
          return dataPedido >= trintaDiasAtras && p.dataEntrega; // Pedidos que foram entregues
        }
      )
      .reduce((acc, p) => acc + p.valorTotal, 0);

    return total;
  };

  const getUltimoPedido = (clienteId: string): Date | null => {
    const pedidosCliente = pedidos.filter(p => p.clienteId === clienteId);
    if (pedidosCliente.length === 0) return null;
    
    const maisRecente = pedidosCliente.reduce((prev, current) => {
      const prevDate = prev.createdAt ? parseISO(prev.createdAt) : new Date(0);
      const currentDate = current.createdAt ? parseISO(current.createdAt) : new Date(0);
      return currentDate > prevDate ? current : prev;
    });

    return maisRecente.createdAt ? parseISO(maisRecente.createdAt) : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes</p>
        </div>
        <Dialog open={dialogNovoOpen} onOpenChange={setDialogNovoOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white shadow-custom-md">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
              <DialogDescription>
                Preencha as informações do cliente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  placeholder="Nome completo"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  placeholder="(11) 99999-9999"
                  value={novoTelefone}
                  onChange={(e) => setNovoTelefone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  placeholder="Rua, número, complemento, bairro"
                  value={novoEndereco}
                  onChange={(e) => setNovoEndereco(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="obs">Observações</Label>
                <Textarea
                  id="obs"
                  placeholder="Preferências, restrições alimentares..."
                  value={novasObservacoes}
                  onChange={(e) => setNovasObservacoes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDialogNovoOpen(false)} disabled={salvando}>
                Cancelar
              </Button>
              <Button onClick={criarNovoCliente} className="gradient-primary text-white" disabled={salvando}>
                {salvando ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</> : "Cadastrar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientesFiltrados.map((cliente) => {
          const totalGasto = getTotalGasto30d(cliente.id!);
          const ultimoPedido = getUltimoPedido(cliente.id!);
          const telefoneLink = cliente.telefones?.replace(/\D/g, "") || "";

          return (
            <Card key={cliente.id} className="shadow-custom-md border-0">
              <CardHeader>
                <CardTitle className="text-lg">{cliente.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cliente.telefones && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`https://wa.me/55${telefoneLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {cliente.telefones}
                    </a>
                  </div>
                )}

                {cliente.email && (
                  <div className="text-sm text-muted-foreground">
                    {cliente.email}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Último pedido</p>
                    <p className="text-sm font-medium">
                      {ultimoPedido
                        ? format(ultimoPedido, "dd/MM/yyyy", { locale: ptBR })
                        : "Nunca"}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-xs text-muted-foreground">Gasto (30d)</p>
                    <p className="text-sm font-semibold text-primary">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(totalGasto)}
                    </p>
                  </div>
                </div>

                {cliente.observacoes && (
                  <Badge variant="outline" className="text-xs">
                    {cliente.observacoes}
                  </Badge>
                )}

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => abrirDetalhes(cliente)}
                >
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog de Detalhes */}
      <Dialog open={dialogDetalhesOpen} onOpenChange={setDialogDetalhesOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {clienteSelecionado && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{clienteSelecionado.nome}</DialogTitle>
                <DialogDescription>
                  Informações completas do cliente
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  {clienteSelecionado.telefones && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>Telefone</span>
                      </div>
                      <a
                        href={`https://wa.me/55${clienteSelecionado.telefones.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        {clienteSelecionado.telefones}
                      </a>
                    </div>
                  )}

                  {clienteSelecionado.email && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>E-mail</span>
                      </div>
                      <p className="font-medium">{clienteSelecionado.email}</p>
                    </div>
                  )}
                </div>

                {clienteSelecionado.endereco && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Endereço</span>
                    </div>
                    <p className="font-medium">{clienteSelecionado.endereco}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Último Pedido</span>
                    </div>
                    <p className="font-medium">
                      {(() => {
                        const ultimo = getUltimoPedido(clienteSelecionado.id!);
                        return ultimo ? format(ultimo, "dd/MM/yyyy", { locale: ptBR }) : "Nunca";
                      })()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>Total Gasto (30d)</span>
                    </div>
                    <p className="font-semibold text-primary">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(getTotalGasto30d(clienteSelecionado.id!))}
                    </p>
                  </div>
                </div>

                {clienteSelecionado.observacoes && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Observações</div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm">{clienteSelecionado.observacoes}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-4 border-t">
                  <div className="text-sm font-medium">Histórico de Pedidos</div>
                  <div className="space-y-2">
                    {pedidos
                      .filter((p) => p.clienteId === clienteSelecionado.id)
                      .slice(0, 5)
                      .map((pedido) => (
                        <div key={pedido.id} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                          <div>
                            <p className="text-sm font-medium">
                              {pedido.createdAt && format(parseISO(pedido.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                            <p className="text-xs text-muted-foreground">{pedido.status}</p>
                          </div>
                          <p className="font-semibold">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(pedido.valorTotal)}
                          </p>
                        </div>
                      ))}
                    {pedidos.filter((p) => p.clienteId === clienteSelecionado.id).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum pedido encontrado
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between gap-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o cliente <strong>{clienteSelecionado.nome}</strong>? 
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => excluirCliente(clienteSelecionado)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setDialogDetalhesOpen(false)}>
                    Fechar
                  </Button>
                  <Button 
                    className="gradient-primary text-white"
                    onClick={() => {
                      setDialogDetalhesOpen(false);
                      abrirEditar(clienteSelecionado);
                    }}
                  >
                    Editar Cliente
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Edição */}
      <Dialog open={dialogEditarOpen} onOpenChange={setDialogEditarOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {clienteSelecionado && (
            <>
              <DialogHeader>
                <DialogTitle>Editar Cliente</DialogTitle>
                <DialogDescription>
                  Atualize as informações do cliente
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editar-nome">Nome *</Label>
                  <Input
                    id="editar-nome"
                    value={editarNome}
                    onChange={(e) => setEditarNome(e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editar-telefone">Telefone</Label>
                  <Input
                    id="editar-telefone"
                    value={editarTelefone}
                    onChange={(e) => setEditarTelefone(e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editar-email">E-mail</Label>
                  <Input
                    id="editar-email"
                    type="email"
                    value={editarEmail}
                    onChange={(e) => setEditarEmail(e.target.value)}
                    placeholder="cliente@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editar-endereco">Endereço</Label>
                  <Input
                    id="editar-endereco"
                    value={editarEndereco}
                    onChange={(e) => setEditarEndereco(e.target.value)}
                    placeholder="Rua, número, complemento, bairro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editar-observacoes">Observações</Label>
                  <Textarea
                    id="editar-observacoes"
                    value={editarObservacoes}
                    onChange={(e) => setEditarObservacoes(e.target.value)}
                    placeholder="Informações adicionais..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogEditarOpen(false)} disabled={salvando}>
                  Cancelar
                </Button>
                <Button onClick={salvarEdicao} disabled={salvando} className="gradient-primary text-white">
                  {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Alterações"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {clientesFiltrados.length === 0 && (
        <Card className="shadow-custom-md border-0">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
