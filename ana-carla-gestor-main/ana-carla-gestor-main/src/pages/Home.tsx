import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Utensils, Users, ShoppingCart, BarChart3 } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50">
      {/* Header com botão Admin */}
      <header className="w-full py-4 px-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">Ana Carla ERP</div>
        <Button 
          variant="default" 
          className="gradient-primary text-white"
          onClick={() => navigate("/login")}
        >
          Admin
        </Button>
      </header>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-in fade-in duration-700">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Bem-vindo ao Ana Carla ERP
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Sistema completo de gestão para o seu negócio de alimentação saudável
          </p>
        </div>

        {/* Cards de funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="shadow-custom-md border-0 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão de Clientes</h3>
              <p className="text-muted-foreground">
                Gerencie seus clientes e acompanhe o histórico de pedidos
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-custom-md border-0 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Utensils className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cardápio Digital</h3>
              <p className="text-muted-foreground">
                Organize seu cardápio e compartilhe facilmente no WhatsApp
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-custom-md border-0 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Controle de Pedidos</h3>
              <p className="text-muted-foreground">
                Acompanhe pedidos em tempo real com quadro Kanban
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-custom-md border-0 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dashboard Completo</h3>
              <p className="text-muted-foreground">
                Visualize métricas e relatórios do seu negócio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-20">
          <p className="text-muted-foreground">
            Sistema desenvolvido para otimizar a gestão do seu negócio
          </p>
        </div>
      </div>
    </div>
  );
}

