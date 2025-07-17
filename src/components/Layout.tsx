import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useProcessFlow } from '@/context/ProcessFlowContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  LayoutDashboard,
  Package,
  Users,
  Settings,
  BarChart3,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  Palette,
  Shield,
  Building,
  MessageSquare
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { currentUser, logout, notificacoes, temPermissao } = useProcessFlow();
  const [sidebarAberta, setSidebarAberta] = useState(false);

  const notificacaoNaoLidas = notificacoes.filter(n => !n.lida).length;

  // Se o usuário é leitor, mostrar layout simplificado sem sidebar
  if (currentUser?.role === 'leitor') {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex h-screen">
          <div className="flex-1 flex flex-col">
            {/* Header simplificado para leitor */}
            <header className="bg-card border-b px-4 lg:px-6 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">ProcessFlow</h2>
                    <p className="text-xs text-muted-foreground">Portal do Cliente</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Botão de alternância de tema para layout simplificado */}
                <ThemeToggle />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                          {currentUser?.nome.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {currentUser?.nome}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser?.email}
                        </p>
                        <Badge 
                          className="w-fit mt-1 bg-muted text-muted-foreground"
                          variant="secondary"
                        >
                          Cliente
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Conteúdo da página */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </div>
    );
  }

  // Ajustar menu baseado no role do usuário
  const getMenuItemsForRole = () => {
    const allItems = [
      {
        id: 'dashboard',
        label: 'Dashboard', 
        icon: LayoutDashboard,
        permissao: null
      },
      {
        id: 'processos',
        label: 'Processos',
        icon: Package,
        permissao: 'processos.visualizar'
      },
      {
        id: 'clientes',
        label: 'Clientes',
        icon: Building,
        permissao: null // Todos podem ver clientes
      },
      {
        id: 'usuarios',
        label: 'Usuários',
        icon: Users,
        permissao: 'usuarios.visualizar'
      },
      {
        id: 'relatorios',
        label: 'Relatórios',
        icon: BarChart3,
        permissao: 'relatorios.todos'
      },
      {
        id: 'chat',
        label: 'Chat',
        icon: MessageSquare,
        permissao: 'usuarios.visualizar'
      },
      {
        id: 'configuracoes',
        label: 'Configurações',
        icon: Settings,
        permissao: 'configuracoes.editar'
      }
    ];

    // Filtrar baseado no role
    switch (currentUser?.role) {
      case 'admin':
        return allItems; // Admin vê tudo
      case 'supervisor':
        return allItems.filter(item => 
          ['dashboard', 'processos', 'clientes', 'relatorios', 'chat'].includes(item.id)
        );
      case 'operador':
        return allItems.filter(item => 
          ['dashboard', 'processos'].includes(item.id)
        );
      case 'leitor':
        return allItems.filter(item => 
          ['dashboard', 'processos', 'clientes', 'relatorios'].includes(item.id)
        );
      default:
        return allItems.filter(item => item.id === 'dashboard');
    }
  };

  const menuItems = getMenuItemsForRole();

  const menuFiltrado = menuItems.filter(item => 
    !item.permissao || temPermissao(item.permissao)
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-destructive text-destructive-foreground';
      case 'supervisor': return 'bg-warning text-warning-foreground';
      case 'operador': return 'bg-info text-info-foreground';
      case 'leitor': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'supervisor': return 'Supervisor';
      case 'operador': return 'Operador';
      case 'leitor': return 'Leitor';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar para mobile */}
      {sidebarAberta && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r shadow-strong">
            <SidebarContent 
              menuItems={menuFiltrado}
              currentPage={currentPage}
              onPageChange={onPageChange}
              onClose={() => setSidebarAberta(false)}
              mobile
            />
          </div>
        </div>
      )}

      {/* Layout principal */}
      <div className="flex h-screen">
        {/* Sidebar desktop */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 bg-card border-r">
            <SidebarContent 
              menuItems={menuFiltrado}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col lg:pl-64">
          {/* Header */}
          <header className="bg-card border-b px-4 lg:px-6 h-16 flex items-center justify-between">
            {/* Lado esquerdo */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarAberta(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              <div className="hidden md:flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Busca rápida por processos...
                </span>
              </div>
            </div>

            {/* Lado direito */}
            <div className="flex items-center space-x-4">
              {/* Botão de alternância de tema */}
              <ThemeToggle />
              
              {/* Notificações */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {notificacaoNaoLidas > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    variant="destructive"
                  >
                    {notificacaoNaoLidas}
                  </Badge>
                )}
              </Button>

              {/* Menu do usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {currentUser?.nome.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser?.nome}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser?.email}
                      </p>
                      <Badge 
                        className={`w-fit mt-1 ${getRoleColor(currentUser?.role || '')}`}
                        variant="secondary"
                      >
                        {getRoleLabel(currentUser?.role || '')}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  {temPermissao('configuracoes.editar') && (
                    <DropdownMenuItem onClick={() => onPageChange('configuracoes')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </DropdownMenuItem>
                  )}
                  {temPermissao('branding.editar') && (
                    <DropdownMenuItem>
                      <Palette className="mr-2 h-4 w-4" />
                      <span>Personalização</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Conteúdo da página */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

// Componente da sidebar
interface SidebarContentProps {
  menuItems: any[];
  currentPage: string;
  onPageChange: (page: string) => void;
  onClose?: () => void;
  mobile?: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ 
  menuItems, 
  currentPage, 
  onPageChange, 
  onClose,
  mobile = false 
}) => {
  const { tenant } = useProcessFlow();

  const handlePageChange = (page: string) => {
    onPageChange(page);
    if (mobile && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Header da sidebar */}
      <div className="flex items-center justify-between h-16 px-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold">ProcessFlow</h2>
            <p className="text-xs text-muted-foreground">{tenant?.nome}</p>
          </div>
        </div>
        
        {mobile && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Menu de navegação */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start ${
                isActive 
                  ? "bg-gradient-primary text-primary-foreground" 
                  : "hover:bg-accent"
              }`}
              onClick={() => handlePageChange(item.id)}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Footer da sidebar */}
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>ProcessFlow v1.0</p>
          <p>Sistema de Gestão</p>
          <div className="flex items-center gap-1 mt-2">
            <Shield className="w-3 h-3" />
            <span>Multi-tenant RBAC</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;