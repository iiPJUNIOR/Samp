import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useProcessFlow } from '@/context/ProcessFlowContext';
import { Lock, Mail, LogIn, Users, Settings, Eye, Building } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { login } = useProcessFlow();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    
    try {
      await login(email, senha);
    } finally {
      setCarregando(false);
    }
  };

  const loginRapido = async (tipo: 'admin' | 'supervisor' | 'operador' | 'cliente') => {
    setCarregando(true);
    try {
      await login(tipo, tipo);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo e título */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-primary rounded-xl mx-auto flex items-center justify-center shadow-soft">
            <Settings className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ProcessFlow
          </h1>
          <p className="text-muted-foreground">
            Sistema de Gestão de Processos
          </p>
        </div>

        {/* Card de login */}
        <Card className="shadow-medium border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Acesso ao Sistema</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o painel
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Formulário de login */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Usuário ou Email
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu usuário"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={carregando}
              >
                {carregando ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Demonstração
                </span>
              </div>
            </div>

            {/* Login rápido para demonstração */}
            <div className="space-y-3">
              <p className="text-xs text-center text-muted-foreground">
                Acesso rápido para demonstração:
              </p>
              
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loginRapido('admin')}
                  disabled={carregando}
                  className="justify-start"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <span className="flex-1 text-left">Administrador</span>
                  <Badge variant="secondary" className="ml-2">
                    Acesso Total
                  </Badge>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loginRapido('supervisor')}
                  disabled={carregando}
                  className="justify-start"
                >
                  <Users className="w-4 h-4 mr-2" />
                  <span className="flex-1 text-left">Supervisor</span>
                  <Badge variant="secondary" className="ml-2">
                    Gestão
                  </Badge>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loginRapido('operador')}
                  disabled={carregando}
                  className="justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="flex-1 text-left">Operador</span>
                  <Badge variant="secondary" className="ml-2">
                    Limitado
                  </Badge>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loginRapido('cliente')}
                  disabled={carregando}
                  className="justify-start"
                >
                  <Building className="w-4 h-4 mr-2" />
                  <span className="flex-1 text-left">Cliente</span>
                  <Badge variant="secondary" className="ml-2">
                    Portal
                  </Badge>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>ProcessFlow v1.0</p>
          <p>Multi-tenant • RBAC • Rastreamento • Relatórios</p>
        </div>
      </div>
    </div>
  );
};

export default Login;