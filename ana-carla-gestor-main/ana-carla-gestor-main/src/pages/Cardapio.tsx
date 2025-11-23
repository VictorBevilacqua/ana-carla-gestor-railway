import { useState, useEffect } from "react";
import { cardapioAPI, CardapioItemDTO } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Salad, Drumstick, Coffee, Droplet, Utensils, Clipboard, Plus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Categoria = "Proteína" | "Salada" | "Acompanhamento" | "Bebida" | "Bowl";

const categoriaIcons: Record<string, React.ElementType> = {
  Salada: Salad,
  Proteína: Drumstick,
  Acompanhamento: Coffee,
  Bebida: Droplet,
  Bowl: Utensils,
};

const formatarBRL = (valor: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valor);
};

const gerarTextoCardapioWhatsApp = (itens: CardapioItemDTO[]): string => {
  const ordemCategorias: string[] = ["Proteína", "Salada", "Acompanhamento", "Bebida", "Bowl"];
  const grupos: Record<string, CardapioItemDTO[]> = {};

  // Agrupar itens ativos por categoria
  itens
    .filter((i) => i.ativo)
    .forEach((i) => {
      const cat = i.categoria || "Outros";
      if (!grupos[cat]) grupos[cat] = [];
      grupos[cat].push(i);
    });

  // Ordenar itens dentro da categoria por nome
  Object.keys(grupos).forEach((cat) => {
    grupos[cat].sort((a, b) => a.nome.localeCompare(b.nome));
  });

  // Ordenar categorias
  const catsOutras = Object.keys(grupos)
    .filter((c) => !ordemCategorias.includes(c))
    .sort((a, b) => a.localeCompare(b));
  const categoriasOrdenadas = [...ordemCategorias, ...catsOutras].filter(
    (c) => grupos[c]?.length
  );

  // Montar texto
  const partes = ["🍱 *Cardápio da Semana*"];
  categoriasOrdenadas.forEach((cat) => {
    partes.push(""); // linha em branco antes da categoria
    partes.push(`*${cat}*`);
    grupos[cat].forEach((item) => {
      const preco = formatarBRL(item.preco);
      partes.push(`• ${item.nome} - ${preco}`);
      if (item.descricao && item.descricao.trim().length) {
        partes.push(`  _${item.descricao.trim()}_`);
      }
    });
  });

  partes.push("", "📱 Faça seu pedido pelo WhatsApp!");
  return partes.join("\n");
};

export default function Cardapio() {
  const [items, setItems] = useState<CardapioItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogNovoOpen, setDialogNovoOpen] = useState(false);
  const [dialogEditarOpen, setDialogEditarOpen] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<CardapioItemDTO | null>(null);
  
  const [novoNome, setNovoNome] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novoPreco, setNovoPreco] = useState("");
  const [novaCategoria, setNovaCategoria] = useState<Categoria>("Proteína");
  const [salvando, setSalvando] = useState(false);

  const [editNome, setEditNome] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [editPreco, setEditPreco] = useState("");
  const [editCategoria, setEditCategoria] = useState<Categoria>("Proteína");

  useEffect(() => {
    carregarItens();
  }, []);

  const carregarItens = async () => {
    try {
      setLoading(true);
      const data = await cardapioAPI.listar();
      setItems(data);
    } catch (error: any) {
      toast.error(`Erro ao carregar cardápio: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleAtivo = async (id: string, ativo: boolean) => {
    try {
      await cardapioAPI.ativarDesativar(id, ativo);
      setItems(items.map(item => item.id === id ? { ...item, ativo } : item));
      toast.success(ativo ? "Item ativado" : "Item desativado");
    } catch (error: any) {
      toast.error(`Erro ao ${ativo ? 'ativar' : 'desativar'} item: ${error.message}`);
    }
  };

  const criarNovoItem = async () => {
    if (!novoNome.trim()) {
      toast.error("Digite o nome do item");
      return;
    }
    if (!novoPreco || parseFloat(novoPreco) <= 0) {
      toast.error("Digite um preço válido");
      return;
    }

    try {
      setSalvando(true);
      const novoItem = await cardapioAPI.criar({
        nome: novoNome,
        descricao: novaDescricao || undefined,
        preco: parseFloat(novoPreco),
        categoria: novaCategoria,
        ativo: true,
      });

      setItems([...items, novoItem]);
      setDialogNovoOpen(false);
      setNovoNome("");
      setNovaDescricao("");
      setNovoPreco("");
      toast.success("Item criado e salvo no banco!");
    } catch (error: any) {
      toast.error(`Erro ao criar item: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const abrirEditar = (item: CardapioItemDTO) => {
    setItemSelecionado(item);
    setEditNome(item.nome);
    setEditDescricao(item.descricao || "");
    setEditPreco(item.preco.toString());
    setEditCategoria(item.categoria as Categoria);
    setDialogEditarOpen(true);
  };

  const salvarEdicao = async () => {
    if (!itemSelecionado || !itemSelecionado.id) return;
    if (!editNome.trim()) {
      toast.error("Digite o nome do item");
      return;
    }
    if (!editPreco || parseFloat(editPreco) <= 0) {
      toast.error("Digite um preço válido");
      return;
    }

    try {
      setSalvando(true);
      const itemAtualizado = await cardapioAPI.atualizar(itemSelecionado.id, {
        nome: editNome,
        descricao: editDescricao || undefined,
        preco: parseFloat(editPreco),
        categoria: editCategoria,
      });

      setItems(items.map(item => item.id === itemSelecionado.id ? itemAtualizado : item));
      setDialogEditarOpen(false);
      toast.success("Item atualizado no banco!");
    } catch (error: any) {
      toast.error(`Erro ao atualizar item: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const excluirItem = async (item: CardapioItemDTO) => {
    if (!item.id) return;
    
    try {
      await cardapioAPI.deletar(item.id);
      setItems(items.filter(i => i.id !== item.id));
      setDialogEditarOpen(false);
      toast.success("Item excluído com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao excluir item: ${error.message}`);
    }
  };

  const copiarCardapioParaWhatsApp = async () => {
    try {
      const texto = gerarTextoCardapioWhatsApp(items);
      await navigator.clipboard.writeText(texto);
      toast.success("Cardápio copiado! Agora é só colar no WhatsApp.");
    } catch (error) {
      toast.error("Erro ao copiar. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasItensAtivos = items.some((item) => item.ativo);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Cardápio</h1>
          <p className="text-muted-foreground">Gerencie os itens do menu</p>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={copiarCardapioParaWhatsApp}
                  disabled={!hasItensAtivos}
                  className="gap-2"
                >
                  <Clipboard className="h-4 w-4" />
                  Copiar para WhatsApp
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {hasItensAtivos
                  ? "Gera um texto do cardápio e copia para você colar no WhatsApp"
                  : "Nenhum item ativo para copiar"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Dialog open={dialogNovoOpen} onOpenChange={setDialogNovoOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white shadow-custom-md">
                <Plus className="h-4 w-4 mr-2" />
                Novo Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Item</DialogTitle>
                <DialogDescription>
                  Adicione um novo item ao cardápio (será salvo no PostgreSQL)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Frango grelhado"
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select value={novaCategoria} onValueChange={(v) => setNovaCategoria(v as Categoria)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Proteína">Proteína</SelectItem>
                      <SelectItem value="Salada">Salada</SelectItem>
                      <SelectItem value="Acompanhamento">Acompanhamento</SelectItem>
                      <SelectItem value="Bebida">Bebida</SelectItem>
                      <SelectItem value="Bowl">Bowl</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (R$) *</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={novoPreco}
                    onChange={(e) => setNovoPreco(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descrição do item..."
                    value={novaDescricao}
                    onChange={(e) => setNovaDescricao(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogNovoOpen(false)} disabled={salvando}>
                  Cancelar
                </Button>
                <Button onClick={criarNovoItem} className="gradient-primary text-white" disabled={salvando}>
                  {salvando ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</> : "Criar Item"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Dialog de Editar */}
      <Dialog open={dialogEditarOpen} onOpenChange={setDialogEditarOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
            <DialogDescription>
              Altere as informações do item (será salvo no PostgreSQL)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nome">Nome *</Label>
              <Input
                id="edit-nome"
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-categoria">Categoria *</Label>
              <Select value={editCategoria} onValueChange={(v) => setEditCategoria(v as Categoria)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Proteína">Proteína</SelectItem>
                  <SelectItem value="Salada">Salada</SelectItem>
                  <SelectItem value="Acompanhamento">Acompanhamento</SelectItem>
                  <SelectItem value="Bebida">Bebida</SelectItem>
                  <SelectItem value="Bowl">Bowl</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-preco">Preço (R$) *</Label>
              <Input
                id="edit-preco"
                type="number"
                step="0.01"
                min="0"
                value={editPreco}
                onChange={(e) => setEditPreco(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-descricao">Descrição</Label>
              <Textarea
                id="edit-descricao"
                value={editDescricao}
                onChange={(e) => setEditDescricao(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-between gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2" disabled={salvando}>
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o item <strong>{itemSelecionado?.nome}</strong> do cardápio? 
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => itemSelecionado && excluirItem(itemSelecionado)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDialogEditarOpen(false)} disabled={salvando}>
                Cancelar
              </Button>
              <Button onClick={salvarEdicao} className="gradient-primary text-white" disabled={salvando}>
                {salvando ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</> : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const Icon = categoriaIcons[item.categoria] || Utensils;
          return (
            <Card key={item.id} className="shadow-custom-md border-0">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{item.nome}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.categoria}
                    </Badge>
                  </div>
                  <Switch
                    checked={item.ativo}
                    onCheckedChange={(checked) => toggleAtivo(item.id!, checked)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{item.descricao || "Sem descrição"}</p>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.preco)}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => abrirEditar(item)}>
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {items.length === 0 && (
        <Card className="shadow-custom-md border-0">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum item no cardápio. Adicione um novo item!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
