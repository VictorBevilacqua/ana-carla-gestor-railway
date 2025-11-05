import { dataStore } from "@/lib/dataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingBag, Users, TrendingUp, AlertCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const pedidosHoje = dataStore.pedidos.filter(
    (p) => p.dataCriacao >= hoje
  );

  const receitaHoje = pedidosHoje
    .filter((p) => p.pago)
    .reduce((acc, p) => acc + p.total, 0);

  const pedidosFila = dataStore.pedidos.filter(
    (p) => p.status === "Novo" || p.status === "Em preparo"
  ).length;

  const trintaDiasAtras = new Date(hoje);
  trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

  const clientesAtivos = new Set(
    dataStore.pedidos
      .filter((p) => p.dataCriacao >= trintaDiasAtras)
      .map((p) => p.clienteId)
  ).size;

  const totalPedidos30d = dataStore.pedidos.filter(
    (p) => p.dataCriacao >= trintaDiasAtras
  ).length;

  const receita30d = dataStore.pedidos
    .filter((p) => p.dataCriacao >= trintaDiasAtras && p.pago)
    .reduce((acc, p) => acc + p.total, 0);

  const ticketMedio = totalPedidos30d > 0 ? receita30d / totalPedidos30d : 0;

  // Alertas
  const alertas = [];

  // Clientes sem pedir há 30 dias
  const clientesSemPedido = dataStore.clientes.filter((c) => {
    if (!c.dataUltimoPedido) return false;
    const diasSemPedido = Math.floor(
      (hoje.getTime() - c.dataUltimoPedido.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diasSemPedido >= 30;
  });

  if (clientesSemPedido.length > 0) {
    alertas.push({
      titulo: `${clientesSemPedido.length} cliente(s) sem pedido há 30+ dias`,
      descricao: clientesSemPedido.map((c) => c.nome).join(", "),
      acao: "Criar pedido",
      onClick: () => navigate("/pedidos"),
    });
  }

  // Pedidos em preparo há muito tempo
  const agora = new Date();
  const pedidosAtrasados = dataStore.pedidos.filter((p) => {
    if (p.status !== "Em preparo") return false;
    const minutos = Math.floor(
      (agora.getTime() - p.dataAtualizacao.getTime()) / (1000 * 60)
    );
    return minutos > 45;
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
  const mediaPedidos7d = dataStore.pedidos.filter(
    (p) => p.dataCriacao >= seteDiasAtras && p.dataCriacao < hoje
  ).length / 7;

  if (pedidosHoje.length < mediaPedidos7d * 0.7) {
    alertas.push({
      titulo: "Movimento abaixo da média",
      descricao: `Hoje: ${pedidosHoje.length} pedidos vs média 7d: ${mediaPedidos7d.toFixed(1)}`,
      acao: "Criar promoção",
      onClick: () => navigate("/pedidos"),
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Painel</h1>
        <p className="text-muted-foreground">Visão geral do negócio</p>
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
            <p className="text-xs text-muted-foreground mt-1">
              {pedidosFila} na fila
            </p>
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
              Pedidos pagos
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
              Total: {dataStore.clientes.length}
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
