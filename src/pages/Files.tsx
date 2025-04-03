
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { FileIcon, FolderIcon, ImageIcon, PlusIcon, UploadIcon, Trash2Icon, EditIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Folder {
  id: string;
  name: string;
  discipline: string;
}

interface File {
  id: string;
  name: string;
  type: "pdf" | "image" | "document";
  discipline: string;
  dateAdded: string;
  size: string;
  folderId?: string;
}

const Files = () => {
  const [files, setFiles] = useState<File[]>([
    {
      id: "1",
      name: "Notas de Aula.pdf",
      type: "pdf",
      discipline: "Matemática",
      dateAdded: "10 de abril",
      size: "2.4 MB"
    },
    {
      id: "2",
      name: "Gráfico de Funções.png",
      type: "image",
      discipline: "Física",
      dateAdded: "15 de abril",
      size: "1.8 MB"
    }
  ]);
  
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [disciplines, setDisciplines] = useState([
    "Todas", "Matemática", "Português", "Física", "Química", "História"
  ]);
  const [selectedDiscipline, setSelectedDiscipline] = useState("Todas");
  const { toast } = useToast();
  
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedDisciplineForFolder, setSelectedDisciplineForFolder] = useState(disciplines[1]);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);

  // Filter files by search and discipline
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiscipline = selectedDiscipline === "Todas" || file.discipline === selectedDiscipline;
    return matchesSearch && matchesDiscipline;
  });
  
  // Filter folders by discipline
  const filteredFolders = folders.filter(folder => {
    return selectedDiscipline === "Todas" || folder.discipline === selectedDiscipline;
  });

  // Handle file upload (simulated)
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    
    const newFiles = Array.from(fileList).map(file => {
      const fileType = file.name.endsWith('.pdf') 
        ? 'pdf' 
        : file.name.endsWith('.png') || file.name.endsWith('.jpg') 
          ? 'image' 
          : 'document';
          
      return {
        id: Date.now().toString(),
        name: file.name,
        type: fileType as "pdf" | "image" | "document",
        discipline: selectedDiscipline === "Todas" ? "Matemática" : selectedDiscipline,
        dateAdded: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }),
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
      };
    });
    
    setFiles([...files, ...newFiles]);
    
    toast({
      title: "Arquivo(s) carregado(s)",
      description: `${newFiles.length} arquivo(s) adicionado(s) com sucesso!`
    });
  };

  // Create new folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Erro",
        description: "Digite um nome para a pasta",
        variant: "destructive"
      });
      return;
    }

    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName,
      discipline: selectedDisciplineForFolder
    };

    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setIsCreateFolderOpen(false);

    toast({
      title: "Pasta criada",
      description: "A pasta foi criada com sucesso!"
    });
  };

  // Handle edit folder
  const openEditFolder = (folder: Folder) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setSelectedDisciplineForFolder(folder.discipline);
    setIsEditFolderOpen(true);
  };

  const handleEditFolder = () => {
    if (!editingFolder) return;
    
    if (!newFolderName.trim()) {
      toast({
        title: "Erro",
        description: "Digite um nome para a pasta",
        variant: "destructive"
      });
      return;
    }

    const updatedFolders = folders.map(folder => 
      folder.id === editingFolder.id 
        ? { ...folder, name: newFolderName, discipline: selectedDisciplineForFolder } 
        : folder
    );

    setFolders(updatedFolders);
    setNewFolderName("");
    setIsEditFolderOpen(false);
    setEditingFolder(null);

    toast({
      title: "Pasta atualizada",
      description: "A pasta foi atualizada com sucesso!"
    });
  };

  // Handle delete folder
  const handleDeleteFolder = (id: string) => {
    // Remove the folder
    setFolders(folders.filter(folder => folder.id !== id));
    
    // Remove files that were in this folder
    setFiles(files.filter(file => file.folderId !== id));

    toast({
      title: "Pasta excluída",
      description: "A pasta foi excluída com sucesso!"
    });
  };

  // File type icons
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileIcon className="text-red-500" />;
      case "image":
        return <ImageIcon className="text-blue-500" />;
      default:
        return <FileIcon className="text-gray-500" />;
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Arquivos</h1>
        <div className="flex gap-2">
          <label htmlFor="file-upload" className="clay-button bg-secondary cursor-pointer flex items-center">
            <UploadIcon className="mr-2" size={18} />
            Carregar Arquivo
            <input 
              id="file-upload" 
              type="file" 
              className="hidden" 
              multiple 
              onChange={handleUpload} 
            />
          </label>
          
          <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
            <DialogTrigger asChild>
              <Button className="clay-button bg-primary text-primary-foreground">
                <PlusIcon className="mr-2" size={18} />
                Nova Pasta
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-2xl shadow-clay border-none">
              <DialogHeader>
                <DialogTitle>Criar Nova Pasta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-2">
                  <label htmlFor="folder-name" className="text-sm font-medium">
                    Nome da Pasta
                  </label>
                  <Input
                    id="folder-name"
                    placeholder="Digite o nome da pasta"
                    className="clay-input"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="folder-discipline" className="text-sm font-medium">
                    Disciplina
                  </label>
                  <select
                    id="folder-discipline"
                    className="clay-input w-full"
                    value={selectedDisciplineForFolder}
                    onChange={(e) => setSelectedDisciplineForFolder(e.target.value)}
                  >
                    {disciplines.slice(1).map(disc => (
                      <option key={disc} value={disc}>{disc}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    className="clay-button bg-secondary"
                    onClick={() => setIsCreateFolderOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="clay-button bg-primary text-primary-foreground"
                    onClick={handleCreateFolder}
                  >
                    Criar Pasta
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Edit Folder Dialog */}
          <Dialog open={isEditFolderOpen} onOpenChange={setIsEditFolderOpen}>
            <DialogContent className="bg-white rounded-2xl shadow-clay border-none">
              <DialogHeader>
                <DialogTitle>Editar Pasta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-2">
                  <label htmlFor="edit-folder-name" className="text-sm font-medium">
                    Nome da Pasta
                  </label>
                  <Input
                    id="edit-folder-name"
                    placeholder="Digite o nome da pasta"
                    className="clay-input"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-folder-discipline" className="text-sm font-medium">
                    Disciplina
                  </label>
                  <select
                    id="edit-folder-discipline"
                    className="clay-input w-full"
                    value={selectedDisciplineForFolder}
                    onChange={(e) => setSelectedDisciplineForFolder(e.target.value)}
                  >
                    {disciplines.slice(1).map(disc => (
                      <option key={disc} value={disc}>{disc}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    className="clay-button bg-secondary"
                    onClick={() => setIsEditFolderOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="clay-button bg-primary text-primary-foreground"
                    onClick={handleEditFolder}
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="clay-card">
            <h3 className="text-lg font-bold mb-4">Disciplinas</h3>
            <div className="space-y-2">
              {disciplines.map(disc => (
                <button
                  key={disc}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedDiscipline === disc 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-clay-blue'
                  }`}
                  onClick={() => setSelectedDiscipline(disc)}
                >
                  {disc}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className="clay-card">
            <div className="flex mb-6">
              <Input
                placeholder="Pesquisar arquivos..."
                className="clay-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="bg-secondary mb-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="docs">Documentos</TabsTrigger>
                <TabsTrigger value="images">Imagens</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div 
                    className="clay-card bg-clay-blue hover:shadow-clay-pressed cursor-pointer transition-all flex flex-col items-center justify-center py-4"
                    onClick={() => setIsCreateFolderOpen(true)}
                  >
                    <FolderIcon size={40} className="text-blue-600 mb-2" />
                    <span className="font-medium">Nova Pasta</span>
                  </div>
                  
                  {/* Display folders */}
                  {filteredFolders.map(folder => (
                    <div key={`folder-${folder.id}`} className="clay-card hover:shadow-clay-pressed cursor-pointer transition-all relative">
                      <div className="flex items-center mb-3">
                        <FolderIcon className="text-blue-600" />
                        <span className="ml-2 font-medium truncate">{folder.name}</span>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger className="ml-auto">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Opções</span>
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white rounded-lg shadow-clay">
                            <DropdownMenuItem 
                              className="cursor-pointer flex items-center" 
                              onClick={() => openEditFolder(folder)}
                            >
                              <EditIcon className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer flex items-center text-red-600" 
                              onClick={() => handleDeleteFolder(folder.id)}
                            >
                              <Trash2Icon className="mr-2 h-4 w-4" />
                              <span>Excluir</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="text-xs text-muted-foreground flex">
                        <span>{folder.discipline}</span>
                      </div>
                    </div>
                  ))}
                  
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map(file => (
                      <div key={file.id} className="clay-card hover:shadow-clay-pressed cursor-pointer transition-all">
                        <div className="flex items-center mb-3">
                          {getFileIcon(file.type)}
                          <span className="ml-2 font-medium truncate">{file.name}</span>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger className="ml-auto">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Opções</span>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                  <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white rounded-lg shadow-clay">
                              <DropdownMenuItem className="cursor-pointer flex items-center">
                                <EditIcon className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer flex items-center text-red-600">
                                <Trash2Icon className="mr-2 h-4 w-4" />
                                <span>Excluir</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span>{file.discipline}</span>
                          <span>{file.size}</span>
                        </div>
                      </div>
                    ))
                  ) : filteredFolders.length === 0 ? (
                    <div className="col-span-full text-center py-10">
                      <p className="text-muted-foreground">Nenhum arquivo encontrado</p>
                    </div>
                  ) : null}
                </div>
              </TabsContent>
              
              <TabsContent value="docs" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFiles.filter(f => f.type === "pdf" || f.type === "document").length > 0 ? (
                    filteredFiles
                      .filter(f => f.type === "pdf" || f.type === "document")
                      .map(file => (
                        <div key={file.id} className="clay-card hover:shadow-clay-pressed cursor-pointer transition-all">
                          <div className="flex items-center mb-3">
                            {getFileIcon(file.type)}
                            <span className="ml-2 font-medium truncate">{file.name}</span>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger className="ml-auto">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Opções</span>
                                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                    <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white rounded-lg shadow-clay">
                                <DropdownMenuItem className="cursor-pointer flex items-center">
                                  <EditIcon className="mr-2 h-4 w-4" />
                                  <span>Editar</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer flex items-center text-red-600">
                                  <Trash2Icon className="mr-2 h-4 w-4" />
                                  <span>Excluir</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="text-xs text-muted-foreground flex justify-between">
                            <span>{file.discipline}</span>
                            <span>{file.size}</span>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="col-span-full text-center py-10">
                      <p className="text-muted-foreground">Nenhum documento encontrado</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="images" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFiles.filter(f => f.type === "image").length > 0 ? (
                    filteredFiles
                      .filter(f => f.type === "image")
                      .map(file => (
                        <div key={file.id} className="clay-card hover:shadow-clay-pressed cursor-pointer transition-all">
                          <div className="flex items-center mb-3">
                            {getFileIcon(file.type)}
                            <span className="ml-2 font-medium truncate">{file.name}</span>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger className="ml-auto">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Opções</span>
                                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                    <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white rounded-lg shadow-clay">
                                <DropdownMenuItem className="cursor-pointer flex items-center">
                                  <EditIcon className="mr-2 h-4 w-4" />
                                  <span>Editar</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer flex items-center text-red-600">
                                  <Trash2Icon className="mr-2 h-4 w-4" />
                                  <span>Excluir</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="text-xs text-muted-foreground flex justify-between">
                            <span>{file.discipline}</span>
                            <span>{file.size}</span>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="col-span-full text-center py-10">
                      <p className="text-muted-foreground">Nenhuma imagem encontrada</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Files;
