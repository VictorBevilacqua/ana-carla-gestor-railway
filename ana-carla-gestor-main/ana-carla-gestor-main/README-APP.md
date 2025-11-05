# Mini-ERP Ana Carla - Sistema de Gestão de Marmitas Saudáveis

Sistema completo de gestão para o negócio de marmitas fit da Ana Carla, desenvolvido em React + TypeScript + Vite.

## 🎯 Funcionalidades Implementadas (MVP)

### ✅ Painel (Dashboard)
- Métricas principais: receita da semana, pedidos na fila, recorrência, CMV
- Gráficos: vendas por semana, mix de categorias, sazonalidade
- Insights e alertas automáticos

### ✅ Pedidos (Kanban)
- Visualização em Kanban com drag & drop
- 4 status: Recebido → Preparando → Pronto → Entregue
- Cards com informações: cliente, itens, valor, tipo de entrega, status de pagamento
- Filtros e ações rápidas

### ✅ Clientes
- Listagem completa com busca
- Integração WhatsApp (botão para abrir conversa)
- Indicadores: prescrição, última compra, inatividade
- Estatísticas da base

### ✅ Cardápio
- Gestão de SKUs por categoria
- Ativação/desativação de produtos
- Tempero da semana
- Gerador de mensagem para WhatsApp (copiar cardápio)

### ✅ Insumos & Compras
- Controle de estoque atual
- Lista de compras automática (+12% folga)
- Baseado em pedidos ativos (Recebido + Preparando)
- Histórico de compras

### ✅ Produção
- Resumo de produção: kg de proteína, arroz, legumes
- Produção por SKU
- Destaque de gargalo (tempo de preparo de legumes)
- Botão para impressão de roteiro

### ✅ Entregas
- Roteiro agrupado por bairro/zona
- Cálculo de frete por regras
- Marcação de entrega concluída
- Resumo: entregas pendentes, zonas, frete total

### ✅ Configurações
- Toggle tema claro/escuro
- LocalStorage opcional (persistência)
- Regras de frete editáveis
- Porções padrão editáveis
- Reset de dados (reseed)
- Roadmap de funcionalidades futuras

## 🎨 Design System

### Cores Principais
- **Primary**: Verde esmeralda (saúde, frescor) - HSL(160, 84%, 39%)
- **Secondary**: Laranja (energia, calor) - HSL(25, 95%, 53%)
- **Accent**: Azul céu (confiança) - HSL(200, 98%, 39%)

### Tokens Semânticos
- Todas as cores definidas em `src/index.css` via CSS variables
- Gradientes: `gradient-primary`, `gradient-secondary`, `gradient-hero`
- Sombras customizadas: `shadow-custom-sm`, `md`, `lg`, `xl`
- Suporte completo a tema claro/escuro

### Componentes
- shadcn/ui como base (Cards, Tables, Buttons, Badges, etc.)
- Customizações: botões com gradientes, sombras elegantes
- Ícones: lucide-react
- Drag & drop: @hello-pangea/dnd
- Gráficos: recharts

## 📊 Dados Mock

Todos os dados estão em `src/lib/dataStore.ts`:
- 4 clientes seed
- 6 SKUs (Frango, Bovino, Suíno, Veggie, Caldo, Salada)
- 9 insumos
- 4 pedidos exemplo
- 1 compra histórica
- 5 regras de frete

## 🚀 Como Usar

1. **Navegação**: Use a sidebar para alternar entre módulos
2. **Pedidos**: Arraste os cards no Kanban para mudar status
3. **Clientes**: Clique no telefone para abrir WhatsApp
4. **Cardápio**: Toggle ativo/inativo, copie mensagem para divulgação
5. **Insumos**: Veja lista de compras automática baseada nos pedidos ativos
6. **Produção**: Confira resumo e imprima roteiro
7. **Entregas**: Marque como entregue quando concluir
8. **Configurações**: Ajuste frete, porções, reset dados

## 🛠 Tecnologias

- **React 18** + TypeScript
- **Vite** (build tool)
- **Tailwind CSS** (estilização)
- **shadcn/ui** (componentes)
- **@hello-pangea/dnd** (drag & drop)
- **recharts** (gráficos)
- **date-fns** (datas)
- **lucide-react** (ícones)
- **React Router** (rotas)
- **Sonner** (toasts)

## 📱 Responsividade

- Design mobile-first
- Grid responsivo em todas as páginas
- Sidebar colapsável
- Testado em desktop, tablet e mobile

## 🔮 Roadmap Futuras Funcionalidades

Ver seção "Roadmap" em **Configurações** para lista completa de melhorias planejadas:
- Bot WhatsApp para coleta automática de pedidos
- Backend real com Supabase/API
- Login multiusuário
- Financeiro completo (CMV real, margem, DRE)
- Alertas automáticos
- B2B/Consignado
- Roteirização com mapas
- Etiquetas com QR code
- Sazonalidade inteligente

## 📄 Licença

MVP desenvolvido para Ana Carla Alimentos Saudáveis - 2025
