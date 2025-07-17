import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useProcessFlow } from '@/context/ProcessFlowContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Shield,
  Key,
  Calendar,
  Mail,
  User as UserIcon,
  MoreHorizontal
} from 'lucide-react';
import { User, UserRole } from '@/types/processflow';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

const UserManagement: React.FC = () => {
  const { 
    usuarios, 
    clientes,
    currentUser, 
    temPermissao, 
    criarUsuario, 
    editarUsuario, 
    excluirUsuario,
    alterarSenha
  } = useProcessFlow();

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [newPassword, setNewPassword] = useState('');

  const usuariosFiltrados = usuarios.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const initFormData = () => {
    setFormData({
      nome: '',
      email: '',
      senha: '',
      role: 'operador' as UserRole,
      setor: '',
      equipe: '',
      ativo: true,
      clientesVinculados: []
    });
  };

  const handleCreateUser = () => {
    if (!temPermissao('usuarios.criar')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para criar usuários",
        variant: "destructive"
      });
      return;
    }

    if (!formData.nome || !formData.email || !formData.senha) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, email e senha",
        variant: "destructive"
      });
      return;
    }

    criarUsuario(formData);
    setShowCreateDialog(false);
    initFormData();
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    
    editarUsuario(selectedUser.id, formData);
    setShowEditDialog(false);
    setSelectedUser(null);
  };

  const handleChangePassword = () => {
    if (!selectedUser || !newPassword) return;
    
    alterarSenha(selectedUser.id, newPassword);
    setShowPasswordDialog(false);
    setSelectedUser(null);
    setNewPassword('');
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      nome: user.nome,
      email: user.email,
      role: user.role,
      setor: user.setor || '',
      equipe: user.equipe || '',
      ativo: user.ativo,
      clientesVinculados: user.clientesVinculados || []
    });
    setShowEditDialog(true);
  };

  const openPasswordDialog = (user: User) => {
    setSelectedUser(user);
    setNewPassword('');
    setShowPasswordDialog(true);
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-destructive text-destructive-foreground';
      case 'supervisor': return 'bg-warning text-warning-foreground';
      case 'operador': return 'bg-info text-info-foreground';
      case 'leitor': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'supervisor': return 'Supervisor';
      case 'operador': return 'Operador';
      case 'leitor': return 'Leitor';
      default: return role;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!temPermissao('usuarios.visualizar')) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-muted-foreground">
                Você não tem permissão para visualizar a gestão de usuários.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, permissões e controle de acesso
          </p>
        </div>
        
        {temPermissao('usuarios.criar') && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={initFormData}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Adicione um novo usuário ao sistema
                </DialogDescription>
              </DialogHeader>
              
              <UserForm formData={formData} setFormData={setFormData} />
              
              <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateUser}>
                  Criar Usuário
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Busca */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por nome, email ou papel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usuariosFiltrados.map(user => (
          <Card key={user.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    {user.nome.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{user.nome}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {temPermissao('usuarios.editar') && (
                          <DropdownMenuItem onClick={() => openEditDialog(user)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {temPermissao('usuarios.editar') && (
                          <DropdownMenuItem onClick={() => openPasswordDialog(user)}>
                            <Key className="w-4 h-4 mr-2" />
                            Alterar Senha
                          </DropdownMenuItem>
                        )}
                        {temPermissao('usuarios.excluir') && user.id !== currentUser?.id && (
                          <DropdownMenuItem 
                            onClick={() => excluirUsuario(user.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Papel:</span>
                <Badge className={getRoleColor(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
              
              {user.setor && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Setor:</span>
                  <span className="text-sm">{user.setor}</span>
                </div>
              )}
              
              {user.equipe && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Equipe:</span>
                  <span className="text-sm">{user.equipe}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={user.ativo ? "default" : "secondary"}>
                  {user.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Criado em:</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(user.dataCriacao)}
                </span>
              </div>
              
              {user.ultimoLogin && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Último acesso:</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(user.ultimoLogin)}
                  </span>
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
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário
            </DialogDescription>
          </DialogHeader>
          
          <UserForm formData={formData} setFormData={setFormData} hidePassword />
          
          <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Alteração de Senha */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>
              Defina uma nova senha para {selectedUser?.nome}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleChangePassword}>
              Alterar Senha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente do formulário de usuário
interface UserFormProps {
  formData: any;
  setFormData: (data: any) => void;
  hidePassword?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ formData, setFormData, hidePassword = false }) => {
  const { clientes } = useProcessFlow();
  
  const [showPermissions, setShowPermissions] = useState(false);
  const [permissions, setPermissions] = useState<{ [key: string]: { visualizar: boolean, criar: boolean, editar: boolean, excluir: boolean } }>({
    processos: { visualizar: true, criar: false, editar: false, excluir: false },
    clientes: { visualizar: true, criar: false, editar: false, excluir: false },
    usuarios: { visualizar: false, criar: false, editar: false, excluir: false },
    relatorios: { visualizar: false, criar: false, editar: false, excluir: false },
    configuracoes: { visualizar: false, criar: false, editar: false, excluir: false }
  });
  
  return (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="nome">Nome Completo *</Label>
      <Input
        id="nome"
        value={formData.nome}
        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        placeholder="Nome do usuário"
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

    {!hidePassword && (
      <div className="space-y-2">
        <Label htmlFor="senha">Senha *</Label>
        <Input
          id="senha"
          type="password"
          value={formData.senha}
          onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
          placeholder="Senha do usuário"
        />
      </div>
    )}

    <div className="space-y-2">
      <Label htmlFor="role">Papel no Sistema</Label>
      <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o papel" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Administrador</SelectItem>
          <SelectItem value="supervisor">Supervisor</SelectItem>
          <SelectItem value="operador">Operador</SelectItem>
          <SelectItem value="leitor">Leitor</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="setor">Setor</Label>
        <Input
          id="setor"
          value={formData.setor}
          onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
          placeholder="Ex: Vendas, Produção"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="equipe">Equipe</Label>
        <Input
          id="equipe"
          value={formData.equipe}
          onChange={(e) => setFormData({ ...formData, equipe: e.target.value })}
          placeholder="Ex: Equipe A, Turno 1"
        />
      </div>
    </div>

    <div className="flex items-center space-x-2">
      <Switch
        id="ativo"
        checked={formData.ativo}
        onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
      />
      <Label htmlFor="ativo">Usuário ativo</Label>
    </div>

    {formData.role === 'leitor' && (
      <div className="space-y-2">
        <Label>Clientes Vinculados</Label>
        <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
          {clientes.filter(c => c.ativo).map(cliente => (
            <div key={cliente.id} className="flex items-center space-x-2 py-1">
              <Checkbox
                id={`cliente-${cliente.id}`}
                checked={formData.clientesVinculados?.includes(cliente.id) || false}
                onCheckedChange={(checked) => {
                  const clientesAtuais = formData.clientesVinculados || [];
                  if (checked) {
                    setFormData({ 
                      ...formData, 
                      clientesVinculados: [...clientesAtuais, cliente.id] 
                    });
                  } else {
                    setFormData({ 
                      ...formData, 
                      clientesVinculados: clientesAtuais.filter(id => id !== cliente.id) 
                    });
                  }
                }}
              />
              <Label htmlFor={`cliente-${cliente.id}`} className="text-sm">
                {cliente.nome}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Usuários leitores só visualizam processos dos clientes selecionados
        </p>
      </div>
    )}

    {/* Permissões Específicas */}
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Permissões Específicas</Label>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowPermissions(!showPermissions)}
        >
          {showPermissions ? 'Ocultar' : 'Configurar'} Permissões
        </Button>
      </div>
      
      {showPermissions && (
        <div className="border rounded-lg p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure permissões específicas para este usuário (sobrepõe as permissões padrão do papel)
          </p>
          
          {Object.entries(permissions).map(([modulo, perms]) => (
            <div key={modulo} className="space-y-2">
              <Label className="text-sm font-medium capitalize">{modulo}</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(perms).map(([acao, valor]) => (
                  <div key={acao} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${modulo}-${acao}`}
                      checked={valor}
                      onCheckedChange={(checked) => {
                        setPermissions(prev => ({
                          ...prev,
                          [modulo]: {
                            ...prev[modulo],
                            [acao]: checked
                          }
                        }));
                      }}
                    />
                    <Label htmlFor={`${modulo}-${acao}`} className="text-xs capitalize">
                      {acao}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  );
};

export default UserManagement;