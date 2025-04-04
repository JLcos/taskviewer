
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { File, FolderIcon, PenIcon, TrashIcon, UploadIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// File interface
interface FileItem {
  id: string;
  name: string;
  type: string;
  discipline: string;
  date: string;
  size: string;
}

// Storage key for files
const FILES_STORAGE_KEY = 'task-viewer-files';

interface FilesProps {
  disciplines: string[];
  onAddDiscipline: (name: string) => void;
  onEditDiscipline: (oldName: string, newName: string) => void;
  onDeleteDiscipline: (name: string) => void;
}

export default function Files({ disciplines, onAddDiscipline, onEditDiscipline, onDeleteDiscipline }: FilesProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState("pdf");
  const [newFileDiscipline, setNewFileDiscipline] = useState(disciplines[0] || "");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const { toast } = useToast();

  // Load files from localStorage on component mount
  useEffect(() => {
    const savedFiles = localStorage.getItem(FILES_STORAGE_KEY);
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    }
  }, []);

  // Save files to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(files));
  }, [files]);

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.discipline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFile = () => {
    if (!newFileName.trim()) {
      toast({
        title: "Nome inválido",
        description: "Por favor, insira um nome para o arquivo",
        variant: "destructive"
      });
      return;
    }

    const newFile: FileItem = {
      id: Date.now().toString(),
      name: newFileName,
      type: newFileType,
      discipline: newFileDiscipline,
      date: new Date().toLocaleDateString('pt-BR'),
      size: Math.floor(Math.random() * 10) + 1 + " MB"
    };

    setFiles(prevFiles => [...prevFiles, newFile]);
    setNewFileName("");
    setNewFileType("pdf");
    setNewFileDiscipline(disciplines[0] || "");
    setIsAddDialogOpen(false);

    toast({
      title: "Arquivo adicionado",
      description: "O arquivo foi adicionado com sucesso!"
    });
  };

  const handleEditFile = () => {
    if (!editingFile) return;

    setFiles(prevFiles => prevFiles.map(file => 
      file.id === editingFile.id ? editingFile : file
    ));
    
    setIsEditDialogOpen(false);
    setEditingFile(null);

    toast({
      title: "Arquivo atualizado",
      description: "O arquivo foi atualizado com sucesso!"
    });
  };

  const handleDeleteFile = (id: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
    
    toast({
      title: "Arquivo excluído",
      description: "O arquivo foi excluído com sucesso!"
    });
  };

  return (
    <Layout 
      disciplines={disciplines} 
      onAddDiscipline={onAddDiscipline}
      onEditDiscipline={onEditDiscipline}
      onDeleteDiscipline={onDeleteDiscipline}
      onSearch={setSearchTerm}
      searchPlaceholder="Pesquisar por nome, disciplina ou tipo..."
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Arquivos</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="clay-button flex items-center gap-2">
              <UploadIcon size={16} />
              <span>Adicionar Arquivo</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white rounded-2xl shadow-clay border-none">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Arquivo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="fileName" className="text-sm font-medium">Nome do Arquivo</label>
                <Input
                  id="fileName"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="clay-input"
                  placeholder="Digite o nome do arquivo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="fileType" className="text-sm font-medium">Tipo de Arquivo</label>
                <select
                  id="fileType"
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value)}
                  className="clay-input w-full"
                >
                  <option value="pdf">PDF</option>
                  <option value="docx">DOCX</option>
                  <option value="pptx">PPTX</option>
                  <option value="xlsx">XLSX</option>
                  <option value="txt">TXT</option>
                  <option value="jpg">JPG</option>
                  <option value="png">PNG</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="fileDiscipline" className="text-sm font-medium">Disciplina</label>
                <select
                  id="fileDiscipline"
                  value={newFileDiscipline}
                  onChange={(e) => setNewFileDiscipline(e.target.value)}
                  className="clay-input w-full"
                >
                  {disciplines.map(discipline => (
                    <option key={discipline} value={discipline}>{discipline}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={handleAddFile}
                  className="clay-button"
                >
                  Adicionar Arquivo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-white rounded-2xl shadow-clay border-none">
            <DialogHeader>
              <DialogTitle>Editar Arquivo</DialogTitle>
            </DialogHeader>
            {editingFile && (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="editFileName" className="text-sm font-medium">Nome do Arquivo</label>
                  <Input
                    id="editFileName"
                    value={editingFile.name}
                    onChange={(e) => setEditingFile({...editingFile, name: e.target.value})}
                    className="clay-input"
                    placeholder="Digite o nome do arquivo"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="editFileType" className="text-sm font-medium">Tipo de Arquivo</label>
                  <select
                    id="editFileType"
                    value={editingFile.type}
                    onChange={(e) => setEditingFile({...editingFile, type: e.target.value})}
                    className="clay-input w-full"
                  >
                    <option value="pdf">PDF</option>
                    <option value="docx">DOCX</option>
                    <option value="pptx">PPTX</option>
                    <option value="xlsx">XLSX</option>
                    <option value="txt">TXT</option>
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="editFileDiscipline" className="text-sm font-medium">Disciplina</label>
                  <select
                    id="editFileDiscipline"
                    value={editingFile.discipline}
                    onChange={(e) => setEditingFile({...editingFile, discipline: e.target.value})}
                    className="clay-input w-full"
                  >
                    {disciplines.map(discipline => (
                      <option key={discipline} value={discipline}>{discipline}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    onClick={handleEditFile}
                    className="clay-button"
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="clay-card overflow-hidden">
        {filteredFiles.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-clay-blue`}>
                        <File size={16} />
                      </div>
                      <span>{file.name}.{file.type}</span>
                    </TableCell>
                    <TableCell>{file.discipline}</TableCell>
                    <TableCell>{file.date}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingFile(file);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <PenIcon size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-12">
            <div className="mx-auto w-12 h-12 rounded-full bg-clay-blue flex items-center justify-center mb-4">
              <FolderIcon className="text-blue-700" />
            </div>
            <h3 className="text-lg font-medium mb-2">Sem arquivos</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm ? "Nenhum arquivo corresponde à sua pesquisa." : "Você ainda não tem nenhum arquivo. Adicione seu primeiro arquivo."}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="clay-button"
              >
                <UploadIcon size={16} className="mr-2" />
                Adicionar Arquivo
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
