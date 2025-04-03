
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface NotFoundProps {
  disciplines: string[];
  onAddDiscipline: (name: string) => void;
}

const NotFound = ({ disciplines, onAddDiscipline }: NotFoundProps) => {
  return (
    <Layout disciplines={disciplines} onAddDiscipline={onAddDiscipline}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-8xl font-bold text-muted-foreground/20 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-muted-foreground mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild className="clay-button bg-primary text-primary-foreground">
          <Link to="/">Voltar ao início</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
