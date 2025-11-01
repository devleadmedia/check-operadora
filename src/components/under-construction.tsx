import { Construction, Wrench, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface UnderConstructionProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export function UnderConstruction({
  title,
  description,
}: UnderConstructionProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] p-6">
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
              <Wrench size={12} className="text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Construction size={16} />
              <span>Em Construção</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {description ||
                "Esta funcionalidade está sendo desenvolvida e estará disponível em breve."}
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">
              Progresso do desenvolvimento
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-1000 animate-pulse"
                style={{ width: "35%" }}
              />
            </div>
            <div className="text-xs text-muted-foreground">35% concluído</div>
          </div>

          <div className="pt-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="gap-2 hover:scale-105 transition-transform"
            >
              <ArrowLeft size={16} />
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
