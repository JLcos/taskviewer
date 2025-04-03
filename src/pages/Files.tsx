
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { FileIcon, FolderIcon, ImageIcon, PlusIcon, UploadIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface File {
  id: string;
  name: string;
  type: "pdf" | "image" | "document";
  discipline: string;
  dateAdded: string;
  size: string;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [disciplines, setDisciplines] = useState([
    "Todas", "Matemática", "Português", "Física", "Química", "História"
  ]);
  const [selectedDiscipline, setSelectedDiscipline] = useState("Todas");
  const { toast } = useToast();

  // Filter files by search and discipline
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiscipline = selectedDiscipline === "Todas" || file.discipline === selectedDiscipline;
    return matchesSearch && matchesDiscipline;
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
          
          <Dialog>
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
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="folder-discipline" className="text-sm font-medium">
                    Disciplina
                  </label>
                  <select
                    id="folder-discipline"
                    className="clay-input w-full"
                    defaultValue="Matemática"
                  >
                    {disciplines.slice(1).map(disc => (
                      <option key={disc} value={disc}>{disc}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" className="clay-button bg-secondary">
                    Cancelar
                  </Button>
                  <Button className="clay-button bg-primary text-primary-foreground">
                    Criar Pasta
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
                  <div className="clay-card bg-clay-blue hover:shadow-clay-pressed cursor-pointer transition-all flex flex-col items-center justify-center py-4">
                    <FolderIcon size={40} className="text-blue-600 mb-2" />
                    <span className="font-medium">Nova Pasta</span>
                  </div>
                  
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map(file => (
                      <div key={file.id} className="clay-card hover:shadow-clay-pressed cursor-pointer transition-all">
                        <div className="flex items-center mb-3">
                          {getFileIcon(file.type)}
                          <span className="ml-2 font-medium truncate">{file.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span>{file.discipline}</span>
                          <span>{file.size}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10">
                      <p className="text-muted-foreground">Nenhum arquivo encontrado</p>
                    </div>
                  )}
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
