
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <Layout 
      disciplines={[]} 
      onAddDiscipline={() => {}}
    >
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-semibold mt-4 mb-6">Página não encontrada</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            A página que você está procurando pode ter sido removida, renomeada 
            ou está temporariamente indisponível.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              asChild 
              className="clay-button bg-primary text-primary-foreground px-6 py-3 text-lg"
            >
              <Link to="/">Voltar para o início</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFound;
