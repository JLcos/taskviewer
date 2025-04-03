
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface NotFoundProps {
  disciplines: string[];
  onAddDiscipline: (name: string) => void;
  onEditDiscipline: (oldName: string, newName: string) => void;
  onDeleteDiscipline: (name: string) => void;
}

const NotFound = ({ disciplines, onAddDiscipline, onEditDiscipline, onDeleteDiscipline }: NotFoundProps) => {
  return (
    <Layout disciplines={disciplines} onAddDiscipline={onAddDiscipline} onEditDiscipline={onEditDiscipline} onDeleteDiscipline={onDeleteDiscipline}>
      <motion.div 
        className="flex flex-col items-center justify-center h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-8xl font-bold text-muted-foreground/20 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          404
        </motion.div>
        <motion.h1 
          className="text-2xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Página não encontrada
        </motion.h1>
        <motion.p 
          className="text-muted-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          A página que você está procurando não existe ou foi movida.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button asChild className="clay-button bg-primary text-primary-foreground" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/">Voltar ao início</Link>
          </Button>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default NotFound;
