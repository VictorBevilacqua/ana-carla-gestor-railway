import { useState, useEffect } from "react";
import { pedidosAPI, PedidoDTO, clientesAPI, ClienteDTO } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingBag, Users, TrendingUp, AlertCircle, Clock, Loader2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { parseISO } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [pedidosData, clientesData] = await Promise.all([
        pedidosAPI.listar(),
        clientesAPI.listar(),
      ]);
      setPedidos(pedidosData);
      setClientes(clientesData);
    } catch (error: any) {
      console.error(`Erro ao carregar dados: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const pedidosHoje = pedidos.filter((p) => {
    const dataPedido = p.dataCriacao ? new Date(parseISO(p.dataCriacao)) : new Date();
    dataPedido.setHours(0, 0, 0, 0);
    return dataPedido.getTime() === hoje.getTime();
  });

  const receitaHoje = pedidosHoje
    .filter((p) => p.dataEntrega) // Pedidos que foram entregues (tem dataEntrega)
    .reduce((acc, p) => acc + p.valorTotal, 0);

  const pedidosFila = pedidos.filter(
    (p) => p.status === "NOVO" || p.status === "EM_PREPARO"
  ).length;

  const trintaDiasAtras = new Date(hoje);
  trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

  const clientesAtivos = new Set(
    pedidos
      .filter((p) => {
        const dataPedido = p.dataCriacao ? new Date(parseISO(p.dataCriacao)) : new Date();
        return dataPedido >= trintaDiasAtras;
      })
      .map((p) => p.clienteId)
  ).size;

  const pedidosEntregues30d = pedidos.filter((p) => {
    const dataPedido = p.dataCriacao ? new Date(parseISO(p.dataCriacao)) : new Date();
    return dataPedido >= trintaDiasAtras && p.dataEntrega; // Apenas pedidos que foram entregues
  });

  console.log(`📊 Dashboard - Pedidos entregues (30d): ${pedidosEntregues30d.length}`);

  const receita30d = pedidosEntregues30d.reduce((acc, p) => acc + p.valorTotal, 0);

  const ticketMedio = pedidosEntregues30d.length > 0 ? receita30d / pedidosEntregues30d.length : 0;
  
  console.log(`💰 Receita 30d: R$ ${receita30d.toFixed(2)}`);
  console.log(`🎯 Ticket Médio: R$ ${ticketMedio.toFixed(2)}`);

  // Alertas
  const alertas = [];

  // Clientes sem pedir há 30 dias
  const clientesSemPedido = clientes.filter((c) => {
    if (!c.ultimoPedido) return false;
    try {
      const dataUltimoPedido = new Date(parseISO(c.ultimoPedido));
      const diasSemPedido = Math.floor(
        (hoje.getTime() - dataUltimoPedido.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diasSemPedido >= 30;
    } catch {
      return false;
    }
  });

  if (clientesSemPedido.length > 0) {
    alertas.push({
      titulo: `${clientesSemPedido.length} cliente(s) sem pedido há 30+ dias`,
      descricao: clientesSemPedido.slice(0, 3).map((c) => c.nome).join(", ") + (clientesSemPedido.length > 3 ? "..." : ""),
      acao: "Criar pedido",
      onClick: () => navigate("/pedidos"),
    });
  }

  // Pedidos em preparo há muito tempo
  const agora = new Date();
  const pedidosAtrasados = pedidos.filter((p) => {
    if (p.status !== "EM_PREPARO") return false;
    try {
      const dataAtualizacao = p.dataAtualizacao ? new Date(parseISO(p.dataAtualizacao)) : new Date();
      const minutos = Math.floor(
        (agora.getTime() - dataAtualizacao.getTime()) / (1000 * 60)
      );
      return minutos > 45;
    } catch {
      return false;
    }
  });

  if (pedidosAtrasados.length > 0) {
    alertas.push({
      titulo: `${pedidosAtrasados.length} pedido(s) em preparo há >45min`,
      descricao: "Verifique o status da produção",
      acao: "Ver pedidos",
      onClick: () => navigate("/pedidos"),
    });
  }

  // Baixo movimento
  const seteDiasAtras = new Date(hoje);
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
  const pedidos7d = pedidos.filter((p) => {
    const dataPedido = p.dataCriacao ? new Date(parseISO(p.dataCriacao)) : new Date();
    dataPedido.setHours(0, 0, 0, 0);
    return dataPedido >= seteDiasAtras && dataPedido < hoje;
  });
  const mediaPedidos7d = pedidos7d.length / 7;

  if (mediaPedidos7d > 0 && pedidosHoje.length < mediaPedidos7d * 0.7) {
    alertas.push({
      titulo: "Movimento abaixo da média",
      descricao: `Hoje: ${pedidosHoje.length} pedidos vs média 7d: ${mediaPedidos7d.toFixed(1)}`,
      acao: "Criar promoção",
      onClick: () => navigate("/pedidos"),
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Painel</h1>
          <p className="text-muted-foreground">Visão geral do negócio (dados do PostgreSQL)</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => {
            console.log("🔄 Atualizando Dashboard...");
            carregarDados();
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-custom-md border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pedidos Hoje
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pedidosHoje.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Hoje
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(receitaHoje)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Hoje
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes Ativos (30d)
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{clientesAtivos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total: {clientes.length}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Médio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(ticketMedio)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <Card className="shadow-custom-md border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <AlertCircle className="h-5 w-5 text-warning" />
              Alertas e Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertas.slice(0, 5).map((alerta, i) => (
              <div
                key={i}
                className="flex items-start justify-between p-4 bg-muted/20 rounded-lg"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <h4 className="font-medium text-foreground">{alerta.titulo}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alerta.descricao}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={alerta.onClick}>
                  {alerta.acao}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {alertas.length === 0 && (
        <Card className="shadow-custom-md border-0">
          <CardContent className="py-12 text-center">
            <Badge variant="secondary" className="text-sm">
              Tudo certo! Nenhum alerta no momento.
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
