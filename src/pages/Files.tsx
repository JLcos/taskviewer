
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { FolderIcon, FileIcon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilesProps {
  disciplines: string[];
  onAddDiscipline: (name: string) => void;
  onEditDiscipline: (oldName: string, newName: string) => void;
  onDeleteDiscipline: (name: string) => void;
}

const Files = ({ disciplines, onAddDiscipline, onEditDiscipline, onDeleteDiscipline }: FilesProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const folders = [
    { name: "Documentos", icon: <FolderIcon className="text-yellow-500" /> },
    { name: "Imagens", icon: <FolderIcon className="text-blue-500" /> },
    { name: "Tarefas", icon: <FolderIcon className="text-green-500" /> },
    { name: "Anotações", icon: <FolderIcon className="text-purple-500" /> },
  ];

  const files = [
    { name: "Relatório Final.pdf", icon: <FileIcon className="text-red-500" />, date: "10 de abril, 2025" },
    { name: "Apresentação.pptx", icon: <FileIcon className="text-orange-500" />, date: "8 de abril, 2025" },
    { name: "Dados Estatísticos.xlsx", icon: <FileIcon className="text-green-500" />, date: "5 de abril, 2025" },
    { name: "Anotações.docx", icon: <FileIcon className="text-blue-500" />, date: "3 de abril, 2025" },
  ];

  return (
    <Layout 
      disciplines={disciplines}
      onAddDiscipline={onAddDiscipline}
      onEditDiscipline={onEditDiscipline}
      onDeleteDiscipline={onDeleteDiscipline}
      onSearch={(term) => console.log('Buscar arquivos:', term)}
      searchPlaceholder="Pesquisar arquivos..."
    >
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold">Arquivos</h1>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button className="bg-primary flex items-center gap-2">
            <UploadIcon size={16} />
            Fazer Upload
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        className="mb-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xl font-semibold mb-4">Pastas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {folders.map((folder, index) => (
            <motion.div
              key={folder.name}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="clay-card flex flex-col items-center p-6 cursor-pointer hover:shadow-clay-hover transition-all"
            >
              <motion.div 
                className="text-4xl mb-3"
                whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {folder.icon}
              </motion.div>
              <h3 className="text-center font-medium">{folder.name}</h3>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xl font-semibold mb-4">Arquivos Recentes</h2>
        <div className="clay-card divide-y">
          {files.map((file, index) => (
            <motion.div
              key={file.name}
              variants={itemVariants}
              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
              className="flex items-center gap-3 p-4 cursor-pointer transition-colors"
            >
              <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
                {file.icon}
              </motion.div>
              <div className="flex-1">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{file.date}</p>
              </div>
              <motion.button 
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FileIcon size={16} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Layout>
  );
};

export default Files;
