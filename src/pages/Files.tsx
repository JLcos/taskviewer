
import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { File, FolderIcon, PenIcon, TrashIcon, UploadIcon, DownloadIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// File interface
interface FileItem {
  id: string;
  name: string;
  type: string;
  discipline: string;
  date: string;
  size: string;
  data?: string; // Base64 data for the file
}

// Storage key for files
const FILES_STORAGE_KEY = 'task-viewer-files';

interface FilesProps {
  disciplines: string[];
  onAddDiscipline: (name: string) => void;
  onEditDiscipline: (oldName: string, newName: string) => void;
  onDeleteDiscipline: (name: string) => void;
}

const getFileIcon = (fileType: string) => {
  switch(fileType.toLowerCase()) {
    case 'pdf':
      return <File size={16} className="text-red-500" />;
    case 'docx':
    case 'doc':
      return <File size={16} className="text-blue-500" />;
    case 'xlsx':
    case 'xls':
      return <File size={16} className="text-green-500" />;
    case 'pptx':
    case 'ppt':
      return <File size={16} className="text-orange-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <File size={16} className="text-purple-500" />;
    default:
      return <File size={16} />;
  }
};

export default function Files({ disciplines, onAddDiscipline, onEditDiscipline, onDeleteDiscipline }: FilesProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFileDiscipline, setNewFileDiscipline] = useState(disciplines[0] || "");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      
      // Auto-fill filename
      const nameParts = file.name.split('.');
      if (nameParts.length > 1) {
        // Remove the extension from the name
        nameParts.pop();
        setNewFileName(nameParts.join('.'));
      } else {
        setNewFileName(file.name);
      }
    }
  };

  const handleAddFile = () => {
    if (!newFileName.trim()) {
      toast({
        title: "Nome inválido",
        description: "Por favor, insira um nome para o arquivo",
        variant: "destructive"
      });
      return;
    }

    if (!uploadedFile) {
      toast({
        title: "Arquivo não selecionado",
        description: "Por favor, selecione um arquivo para upload",
        variant: "destructive"
      });
      return;
    }

    // Read the file data
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const fileExtension = uploadedFile.name.split('.').pop() || '';
        
        const newFile: FileItem = {
          id: Date.now().toString(),
          name: newFileName,
          type: fileExtension,
          discipline: newFileDiscipline,
          date: new Date().toLocaleDateString('pt-BR'),
          size: `${Math.round(uploadedFile.size / 1024)} KB`,
          data: event.target.result.toString()
        };

        setFiles(prevFiles => [...prevFiles, newFile]);
        setNewFileName("");
        setNewFileDiscipline(disciplines[0] || "");
        setUploadedFile(null);
        setIsAddDialogOpen(false);

        toast({
          title: "Arquivo adicionado",
          description: "O arquivo foi adicionado com sucesso!"
        });
      }
    };
    reader.readAsDataURL(uploadedFile);
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

  const handleDownloadFile = (file: FileItem) => {
    if (!file.data) {
      toast({
        title: "Erro ao baixar",
        description: "Dados do arquivo não encontrados",
        variant: "destructive"
      });
      return;
    }

    // Create a temporary anchor element to download the file
    const link = document.createElement('a');
    link.href = file.data;
    link.download = `${file.name}.${file.type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download iniciado",
      description: "O arquivo está sendo baixado"
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
                <label htmlFor="fileUpload" className="text-sm font-medium">Selecionar Arquivo</label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors hover:border-primary">
                  <input
                    type="file"
                    id="fileUpload"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <UploadIcon size={40} className="text-gray-400 mb-2" />
                  <p className="text-sm text-center text-gray-500 mb-2">
                    {uploadedFile ? uploadedFile.name : "Clique para selecionar ou arraste um arquivo aqui"}
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2"
                  >
                    Escolher Arquivo
                  </Button>
                </div>
              </div>
              
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
                  disabled={!uploadedFile || !newFileName}
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
                        {getFileIcon(file.type)}
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
                          onClick={() => handleDownloadFile(file)}
                          title="Baixar arquivo"
                        >
                          <DownloadIcon size={16} className="text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingFile(file);
                            setIsEditDialogOpen(true);
                          }}
                          title="Editar informações"
                        >
                          <PenIcon size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Excluir arquivo"
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
