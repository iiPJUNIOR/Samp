import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Settings, Users, Package, BarChart3, Shield, Palette, Database, Zap } from 'lucide-react';

const SystemStatus: React.FC = () => {
  const recursos = [
    {
      categoria: "🔐 Autenticação & Segurança",
      items: [
        { nome: "Sistema de Login", status: "✅", descricao: "Com usuários admin, supervisor e operador" },
        { nome: "RBAC (Controle de Acesso)", status: "✅", descricao: "4 níveis de permissão implementados" },
        { nome: "Multi-tenant", status: "✅", descricao: "Isolamento de dados por empresa" },
        { nome: "Autenticação Mock", status: "✅", descricao: "Pronto para integração com backends" }
      ]
    },
    {
      categoria: "🎨 Interface & Design",
      items: [
        { nome: "Design System Profissional", status: "✅", descricao: "Cores, gradientes e componentes personalizados" },
        { nome: "Tema Claro/Escuro", status: "✅", descricao: "Suporte completo a dark mode" },
        { nome: "Layout Responsivo", status: "✅", descricao: "Adaptado para mobile, tablet e desktop" },
        { nome: "Componentes Shadcn Customizados", status: "✅", descricao: "UI moderna e acessível" }
      ]
    },
    {
      categoria: "📊 Dashboard & Métricas",
      items: [
        { nome: "Dashboard Principal", status: "✅", descricao: "Visão geral completa do sistema" },
        { nome: "Métricas em Tempo Real", status: "✅", descricao: "KPIs e estatísticas dinâmicas" },
        { nome: "Gráficos e Indicadores", status: "✅", descricao: "Visualização de performance" },
        { nome: "Filtros Temporais", status: "✅", descricao: "Análise por período customizável" }
      ]
    },
    {
      categoria: "⚙️ Gestão de Processos",
      items: [
        { nome: "Pipeline Configurável", status: "✅", descricao: "6 etapas padrão: Lead → Entrega" },
        { nome: "CRUD Completo", status: "🔄", descricao: "Estrutura implementada, interfaces em desenvolvimento" },
        { nome: "Rastreamento Físico", status: "✅", descricao: "Localização: pátio, salão, rua, expedição" },
        { nome: "Histórico de Movimentações", status: "✅", descricao: "Log completo de alterações" }
      ]
    },
    {
      categoria: "👥 Gestão de Usuários",  
      items: [
        { nome: "CRUD de Usuários", status: "🔄", descricao: "Backend implementado, UI em desenvolvimento" },
        { nome: "Alteração de Senhas", status: "✅", descricao: "Admin pode alterar senhas de qualquer usuário" },
        { nome: "Usuários Padrão", status: "✅", descricao: "admin/admin, supervisor/supervisor, operador/operador" },
        { nome: "Vinculação a Setores", status: "✅", descricao: "Organização por equipes e departamentos" }
      ]
    },
    {
      categoria: "📈 Relatórios & Analytics",
      items: [
        { nome: "Estrutura de Relatórios", status: "🔄", descricao: "Framework preparado, interfaces em desenvolvimento" },
        { nome: "Exportação PDF/Excel", status: "📋", descricao: "Planejado para próxima versão" },
        { nome: "Filtros Avançados", status: "✅", descricao: "Por data, etapa, responsável, localização" },
        { nome: "Métricas de Conversão", status: "✅", descricao: "Taxa lead→venda e tempo médio" }
      ]
    },
    {
      categoria: "🔔 Notificações & Monitoramento",
      items: [
        { nome: "Sistema de Notificações", status: "✅", descricao: "Alertas para processos atrasados e parados" },
        { nome: "Detecção de Gargalos", status: "✅", descricao: "Identificação automática de problemas" },
        { nome: "Notificações em Tempo Real", status: "🔄", descricao: "Base implementada, push notifications planejadas" },
        { nome: "Configurações de Alerta", status: "📋", descricao: "Personalização de gatilhos e frequência" }
      ]
    },
    {
      categoria: "⚡ Performance & Integração",
      items: [
        { nome: "Dados Mock Completos", status: "✅", descricao: "5 processos e 3 usuários de demonstração" },
        { nome: "Onboarding Automático", status: "✅", descricao: "Sistema pronto para uso imediato" },
        { nome: "Arquitetura Escalável", status: "✅", descricao: "Código organizado e bem documentado" },
        { nome: "Preparado para Backend", status: "✅", descricao: "APIs mockadas, fácil integração com Supabase/outros" }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "✅": return "success";
      case "🔄": return "warning";
      case "📋": return "secondary";
      default: return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "✅": return "Concluído";
      case "🔄": return "Em Desenvolvimento";
      case "📋": return "Planejado";
      default: return "N/A";
    }
  };

  const totalItems = recursos.reduce((total, categoria) => total + categoria.items.length, 0);
  const concluidos = recursos.reduce((total, categoria) => 
    total + categoria.items.filter(item => item.status === "✅").length, 0
  );
  const emAndamento = recursos.reduce((total, categoria) => 
    total + categoria.items.filter(item => item.status === "🔄").length, 0
  );

  const percentualConclusao = Math.round((concluidos / totalItems) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-primary rounded-xl mx-auto flex items-center justify-center shadow-medium">
          <CheckCircle className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ProcessFlow v1.0
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Sistema SaaS para Gestão de Processos
          </p>
          <p className="text-sm text-muted-foreground">
            Implementado com React, TypeScript, Tailwind CSS e Shadcn UI
          </p>
        </div>
      </div>

      {/* Progresso geral */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-success" />
            Status de Implementação
          </CardTitle>
          <CardDescription>
            Progresso geral do desenvolvimento do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-success">{concluidos}</div>
              <div className="text-sm text-muted-foreground">Concluídos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning">{emAndamento}</div>
              <div className="text-sm text-muted-foreground">Em Desenvolvimento</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{percentualConclusao}%</div>
              <div className="text-sm text-muted-foreground">Completo</div>
            </div>
          </div>
          
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-success"
              style={{ width: `${percentualConclusao}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de recursos */}
      <div className="grid gap-6">
        {recursos.map((categoria, index) => (
          <Card key={index} className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">{categoria.categoria}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoria.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-medium">{item.nome}</h4>
                        <Badge variant={getStatusColor(item.status) as any}>
                          {getStatusText(item.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Informações técnicas */}
      <Card className="border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Especificações Técnicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">🛠️ Tecnologias Utilizadas</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• React 18 com TypeScript</li>
                <li>• Tailwind CSS + Design System customizado</li>
                <li>• Shadcn UI com componentes personalizados</li>
                <li>• Context API para gerenciamento de estado</li>
                <li>• React Router para navegação</li>
                <li>• Lucide React para ícones</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">🎯 Características Principais</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Sistema Multi-tenant completo</li>
                <li>• RBAC com 4 níveis de acesso</li>
                <li>• Pipeline configurável de 6 etapas</li>
                <li>• Interface responsiva e acessível</li>
                <li>• Dados mock para demonstração</li>
                <li>• Código organizado e documentado</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground space-y-2">
        <p>
          <strong>ProcessFlow</strong> - Sistema SaaS pronto para personalização
        </p>
        <p>
          Desenvolvido com foco em escalabilidade, performance e experiência do usuário
        </p>
      </div>
    </div>
  );
};

export default SystemStatus;