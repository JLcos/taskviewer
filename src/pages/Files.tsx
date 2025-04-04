
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { FolderIcon, FileIcon, UploadIcon, PlusIcon, Trash2Icon, EditIcon, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FilesProps {
  disciplines: string[];
  onAddDiscipline: (name: string) => void;
  onEditDiscipline: (oldName: string, newName: string) => void;
  onDeleteDiscipline: (name: string) => void;
}

interface File {
  id: string;
  name: string;
  icon: JSX.Element;
  date: string;
  size?: string;
  type: string;
}

const Files = ({ disciplines, onAddDiscipline, onEditDiscipline, onDeleteDiscipline }: FilesProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedFileName, setEditedFileName] = useState("");
  
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
    { id: '1', name: "Documentos", icon: <FolderIcon className="text-yellow-500" /> },
    { id: '2', name: "Imagens", icon: <FolderIcon className="text-blue-500" /> },
    { id: '3', name: "Tarefas", icon: <FolderIcon className="text-green-500" /> },
    { id: '4', name: "Anotações", icon: <FolderIcon className="text-purple-500" /> },
  ];

  const [files, setFiles] = useState<File[]>([
    { id: '1', name: "Relatório Final.pdf", icon: <FileIcon className="text-red-500" />, date: "10 de abril, 2025", size: "2.4 MB", type: "pdf" },
    { id: '2', name: "Apresentação.pptx", icon: <FileIcon className="text-orange-500" />, date: "8 de abril, 2025", size: "4.7 MB", type: "pptx" },
    { id: '3', name: "Dados Estatísticos.xlsx", icon: <FileIcon className="text-green-500" />, date: "5 de abril, 2025", size: "1.2 MB", type: "xlsx" },
    { id: '4', name: "Anotações.docx", icon: <FileIcon className="text-blue-500" />, date: "3 de abril, 2025", size: "0.8 MB", type: "docx" },
  ]);

  const handleAddFile = () => {
    if (!newFileName) {
      toast({
        title: "Erro",
        description: "O nome do arquivo não pode estar vazio.",
        variant: "destructive"
      });
      return;
    }

    // Determine file type by extension
    const extension = newFileName.split('.').pop()?.toLowerCase() || '';
    let fileIcon;
    let fileType = extension;

    switch (extension) {
      case 'pdf':
        fileIcon = <FileIcon className="text-red-500" />;
        break;
      case 'docx':
      case 'doc':
        fileIcon = <FileIcon className="text-blue-500" />;
        break;
      case 'xlsx':
      case 'xls':
        fileIcon = <FileIcon className="text-green-500" />;
        break;
      case 'pptx':
      case 'ppt':
        fileIcon = <FileIcon className="text-orange-500" />;
        break;
      case 'jpg':
      case 'png':
      case 'jpeg':
        fileIcon = <FileIcon className="text-purple-500" />;
        break;
      default:
        fileIcon = <FileIcon className="text-gray-500" />;
        fileType = 'unknown';
    }

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()} de ${getMonthName(currentDate.getMonth())}, ${currentDate.getFullYear()}`;

    const newFile: File = {
      id: Date.now().toString(),
      name: newFileName,
      icon: fileIcon,
      date: formattedDate,
      size: '0.1 MB', // Placeholder size
      type: fileType
    };

    setFiles([...files, newFile]);
    setNewFileName("");
    setUploadDialogOpen(false);

    toast({
      title: "Arquivo adicionado",
      description: `O arquivo ${newFileName} foi adicionado com sucesso!`
    });
  };

  const handleEditFile = () => {
    if (!selectedFile) return;
    if (!editedFileName) {
      toast({
        title: "Erro",
        description: "O nome do arquivo não pode estar vazio.",
        variant: "destructive"
      });
      return;
    }

    const updatedFiles = files.map(file => 
      file.id === selectedFile.id 
        ? { ...file, name: editedFileName } 
        : file
    );

    setFiles(updatedFiles);
    setEditDialogOpen(false);
    setSelectedFile(null);
    setEditedFileName("");

    toast({
      title: "Arquivo editado",
      description: "O nome do arquivo foi atualizado com sucesso!"
    });
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
    
    toast({
      title: "Arquivo excluído",
      description: "O arquivo foi excluído com sucesso!"
    });
  };

  const handleFileAction = (action: 'edit' | 'delete', file: File) => {
    if (action === 'edit') {
      setSelectedFile(file);
      setEditedFileName(file.name);
      setEditDialogOpen(true);
    } else if (action === 'delete') {
      handleDeleteFile(file.id);
    }
  };

  const getMonthName = (monthIndex: number): string => {
    const months = [
      "janeiro", "fevereiro", "março", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];
    return months[monthIndex];
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout 
      disciplines={disciplines}
      onAddDiscipline={onAddDiscipline}
      onEditDiscipline={onEditDiscipline}
      onDeleteDiscipline={onDeleteDiscipline}
      onSearch={(term) => setSearchTerm(term)}
      searchPlaceholder="Pesquisar arquivos..."
    >
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-primary">Arquivos</h1>
        
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-primary flex items-center gap-2">
                <UploadIcon size={16} />
                Adicionar Arquivo
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Arquivo</DialogTitle>
              <DialogDescription>
                Digite o nome do arquivo que deseja adicionar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fileName" className="text-right">
                  Nome
                </Label>
                <Input
                  id="fileName"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="exemplo.pdf"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleAddFile}
                className="bg-primary"
              >
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Arquivo</DialogTitle>
              <DialogDescription>
                Altere o nome do arquivo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editFileName" className="text-right">
                  Nome
                </Label>
                <Input
                  id="editFileName"
                  value={editedFileName}
                  onChange={(e) => setEditedFileName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleEditFile}
                className="bg-primary"
              >
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div 
        className="mb-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xl font-semibold mb-4 text-primary">Pastas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <motion.div
              key={folder.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="clay-card flex flex-col items-center p-6 cursor-pointer hover:shadow-clay-hover transition-all bg-white/80"
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
        <h2 className="text-xl font-semibold mb-4 text-primary">Arquivos</h2>
        
        {filteredFiles.length > 0 ? (
          <div className="clay-card divide-y bg-white/90">
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.id}
                variants={itemVariants}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                className="flex items-center gap-3 p-4 cursor-pointer transition-colors relative"
              >
                <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
                  {file.icon}
                </motion.div>
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{file.date}</span>
                    {file.size && <span>{file.size}</span>}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FileIcon size={16} />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white">
                    <DropdownMenuItem onClick={() => handleFileAction('edit', file)}>
                      <EditIcon size={16} className="mr-2" /> Renomear
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFileAction('delete', file)}>
                      <Trash2Icon size={16} className="mr-2" /> Excluir
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <DownloadIcon size={16} className="mr-2" /> Download
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="clay-card p-12 text-center"
            variants={itemVariants}
          >
            <p className="text-lg text-muted-foreground mb-4">
              {searchTerm 
                ? "Nenhum arquivo corresponde à sua pesquisa" 
                : "Nenhum arquivo encontrado"}
            </p>
            <Button 
              onClick={() => setUploadDialogOpen(true)}
              className="bg-primary"
            >
              <PlusIcon size={16} className="mr-2" />
              Adicionar Arquivo
            </Button>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Files;
