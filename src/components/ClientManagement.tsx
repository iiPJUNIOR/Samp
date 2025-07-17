import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building,
  Phone,
  Mail,
  MapPin,
  User as UserIcon,
  MoreHorizontal,
  Package
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { useProcessFlow } from '@/context/ProcessFlowContext';

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  cnpj?: string;
  cpf?: string;
  observacoes: string;
  ativo: boolean;
  dataCriacao: Date;
  totalProcessos: number;
}

const ClientManagement: React.FC = () => {
  const { processos, temPermissao } = useProcessFlow();
  
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: '1',
      nome: 'Empresa ABC Ltda',
      email: 'contato@empresaabc.com',
      telefone: '(11) 98765-4321',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      cnpj: '12.345.678/0001-90',
      cpf: '',
      observacoes: 'Cliente importante - prioridade alta',
      ativo: true,
      dataCriacao: new Date('2024-01-15'),
      totalProcessos: 5
    },
    {
      id: '2',
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '(11) 99888-7777',
      endereco: 'Av. Paulista, 456',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-100',
      cnpj: '',
      cpf: '123.456.789-00',
      observacoes: 'Cliente pessoa física',
      ativo: true,
      dataCriacao: new Date('2024-02-10'),
      totalProcessos: 2
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<any>({});

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone.includes(searchTerm)
  );

  const gerarId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const initFormData = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      cnpj: '',
      cpf: '',
      observacoes: '',
      ativo: true
    });
  };

  const handleCreateClient = () => {
    if (!formData.nome || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos nome e email",
        variant: "destructive"
      });
      return;
    }

    const novoCliente: Cliente = {
      ...formData,
      id: gerarId(),
      dataCriacao: new Date(),
      totalProcessos: 0
    };

    setClientes(prev => [...prev, novoCliente]);
    
    toast({
      title: "Cliente criado",
      description: `${novoCliente.nome} foi adicionado com sucesso`
    });
    
    setShowCreateDialog(false);
    initFormData();
  };

  const handleEditClient = () => {
    if (!selectedClient) return;
    
    setClientes(prev => prev.map(c => 
      c.id === selectedClient.id ? { ...c, ...formData } : c
    ));
    
    toast({
      title: "Cliente atualizado",
      description: "As informações foram salvas com sucesso"
    });
    
    setShowEditDialog(false);
    setSelectedClient(null);
  };

  const handleDeleteClient = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return;

    // Verificar se tem processos vinculados
    const processosVinculados = processos.filter(p => p.cliente === cliente.nome);
    
    if (processosVinculados.length > 0) {
      toast({
        title: "Não é possível excluir",
        description: `Este cliente possui ${processosVinculados.length} processo(s) vinculado(s)`,
        variant: "destructive"
      });
      return;
    }

    setClientes(prev => prev.filter(c => c.id !== clienteId));
    
    toast({
      title: "Cliente removido",
      description: "O cliente foi excluído do sistema"
    });
  };

  const openEditDialog = (cliente: Cliente) => {
    setSelectedClient(cliente);
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      cidade: cliente.cidade,
      estado: cliente.estado,
      cep: cliente.cep,
      cnpj: cliente.cnpj,
      cpf: cliente.cpf,
      observacoes: cliente.observacoes,
      ativo: cliente.ativo
    });
    setShowEditDialog(true);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Atualizar contagem de processos por cliente
  React.useEffect(() => {
    setClientes(prev => prev.map(cliente => ({
      ...cliente,
      totalProcessos: processos.filter(p => p.cliente === cliente.nome).length
    })));
  }, [processos]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie seus clientes e vincule processos
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={initFormData}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Cliente</DialogTitle>
              <DialogDescription>
                Adicione um novo cliente ao sistema
              </DialogDescription>
            </DialogHeader>
            
            <ClientForm formData={formData} setFormData={setFormData} />
            
            <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateClient}>
                Criar Cliente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Busca */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientesFiltrados.map(cliente => (
          <Card key={cliente.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    {cliente.cnpj ? (
                      <Building className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-primary-foreground" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{cliente.nome}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {cliente.email}
                    </CardDescription>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(cliente)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteClient(cliente.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{cliente.telefone}</span>
              </div>
              
              {cliente.endereco && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p>{cliente.endereco}</p>
                    <p className="text-muted-foreground">
                      {cliente.cidade}, {cliente.estado} - {cliente.cep}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tipo:</span>
                <Badge variant={cliente.cnpj ? "default" : "secondary"}>
                  {cliente.cnpj ? "Pessoa Jurídica" : "Pessoa Física"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Processos:</span>
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{cliente.totalProcessos}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={cliente.ativo ? "default" : "secondary"}>
                  {cliente.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cadastrado em:</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(cliente.dataCriacao)}
                </span>
              </div>
              
              {cliente.observacoes && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">{cliente.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de Edição */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Atualize as informações do cliente
            </DialogDescription>
          </DialogHeader>
          
          <ClientForm formData={formData} setFormData={setFormData} />
          
          <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditClient}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente do formulário de cliente
interface ClientFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ formData, setFormData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
    <div className="space-y-2">
      <Label htmlFor="nome">Nome / Razão Social *</Label>
      <Input
        id="nome"
        value={formData.nome}
        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        placeholder="Nome do cliente ou empresa"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="email">Email *</Label>
      <Input
        id="email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="email@exemplo.com"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="telefone">Telefone</Label>
      <Input
        id="telefone"
        value={formData.telefone}
        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
        placeholder="(11) 99999-9999"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="cnpj">CNPJ</Label>
      <Input
        id="cnpj"
        value={formData.cnpj}
        onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
        placeholder="00.000.000/0000-00"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="cpf">CPF</Label>
      <Input
        id="cpf"
        value={formData.cpf}
        onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
        placeholder="000.000.000-00"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="cep">CEP</Label>
      <Input
        id="cep"
        value={formData.cep}
        onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
        placeholder="00000-000"
      />
    </div>

    <div className="col-span-1 md:col-span-2 space-y-2">
      <Label htmlFor="endereco">Endereço</Label>
      <Input
        id="endereco"
        value={formData.endereco}
        onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
        placeholder="Rua, número, complemento"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="cidade">Cidade</Label>
      <Input
        id="cidade"
        value={formData.cidade}
        onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
        placeholder="Cidade"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="estado">Estado</Label>
      <Input
        id="estado"
        value={formData.estado}
        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
        placeholder="UF"
        maxLength={2}
      />
    </div>

    <div className="col-span-1 md:col-span-2 space-y-2">
      <Label htmlFor="observacoes">Observações</Label>
      <Textarea
        id="observacoes"
        value={formData.observacoes}
        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
        placeholder="Observações sobre o cliente..."
        rows={3}
      />
    </div>
  </div>
);

export default ClientManagement;