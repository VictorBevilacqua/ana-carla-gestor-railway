import { useState, useMemo } from "react";
import { dataStore, Cliente } from "@/lib/dataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Phone, Plus, Mail, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>(dataStore.clientes);
  const [busca, setBusca] = useState("");
  const [dialogNovoOpen, setDialogNovoOpen] = useState(false);
  const [dialogDetalhesOpen, setDialogDetalhesOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  
  const [novoNome, setNovoNome] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novasObservacoes, setNovasObservacoes] = useState("");

  const criarNovoCliente = () => {
    if (!novoNome.trim()) {
      toast.error("Digite o nome do cliente");
      return;
    }
    if (!novoTelefone.trim()) {
      toast.error("Digite o telefone do cliente");
      return;
    }

    const novoCliente: Cliente = {
      id: Math.random().toString(36).substring(7),
      nome: novoNome,
      telefone: novoTelefone,
      email: novoEmail,
      observacoes: novasObservacoes,
      dataUltimoPedido: null,
    };

    dataStore.clientes.push(novoCliente);
    setClientes([...dataStore.clientes]);
    setDialogNovoOpen(false);
    setNovoNome("");
    setNovoTelefone("");
    setNovoEmail("");
    setNovasObservacoes("");
    toast.success("Cliente criado com sucesso!");
  };

  const abrirDetalhes = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setDialogDetalhesOpen(true);
  };

  const clientesFiltrados = useMemo(() => {
    if (!busca) return clientes;
    const termo = busca.toLowerCase();
    return clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.telefone.toLowerCase().includes(termo)
    );
  }, [clientes, busca]);

  const getTotalGasto30d = (clienteId: string) => {
    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje);
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

    const total = dataStore.pedidos
      .filter(
        (p) =>
          p.clienteId === clienteId &&
          p.dataCriacao >= trintaDiasAtras &&
          p.pago
      )
      .reduce((acc, p) => acc + p.total, 0);

    return total;
  };

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
              <Button variant="outline" onClick={() => setDialogNovoOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={criarNovoCliente} className="gradient-primary text-white">
                Cadastrar
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
          const totalGasto = getTotalGasto30d(cliente.id);
          const telefoneLink = cliente.telefone.replace(/\D/g, "");

          return (
            <Card key={cliente.id} className="shadow-custom-md border-0">
              <CardHeader>
                <CardTitle className="text-lg">{cliente.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`https://wa.me/55${telefoneLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {cliente.telefone}
                  </a>
                </div>

                {cliente.email && (
                  <div className="text-sm text-muted-foreground">
                    {cliente.email}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Último pedido</p>
                    <p className="text-sm font-medium">
                      {cliente.dataUltimoPedido
                        ? format(cliente.dataUltimoPedido, "dd/MM/yyyy", { locale: ptBR })
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
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>Telefone</span>
                    </div>
                    <a
                      href={`https://wa.me/55${clienteSelecionado.telefone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      {clienteSelecionado.telefone}
                    </a>
                  </div>

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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Último Pedido</span>
                    </div>
                    <p className="font-medium">
                      {clienteSelecionado.dataUltimoPedido
                        ? format(clienteSelecionado.dataUltimoPedido, "dd/MM/yyyy", { locale: ptBR })
                        : "Nunca"}
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
                      }).format(getTotalGasto30d(clienteSelecionado.id))}
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
                    {dataStore.pedidos
                      .filter((p) => p.clienteId === clienteSelecionado.id)
                      .slice(0, 5)
                      .map((pedido) => (
                        <div key={pedido.id} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                          <div>
                            <p className="text-sm font-medium">
                              {format(pedido.dataCriacao, "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                            <p className="text-xs text-muted-foreground">{pedido.status}</p>
                          </div>
                          <p className="font-semibold">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(pedido.total)}
                          </p>
                        </div>
                      ))}
                    {dataStore.pedidos.filter((p) => p.clienteId === clienteSelecionado.id).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum pedido encontrado
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogDetalhesOpen(false)}>
                  Fechar
                </Button>
                <Button className="gradient-primary text-white">
                  Editar Cliente
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
