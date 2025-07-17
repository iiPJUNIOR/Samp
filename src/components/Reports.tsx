import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProcessFlow } from '@/context/ProcessFlowContext';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { toast } from '@/hooks/use-toast';

const Reports: React.FC = () => {
  const { 
    processos, 
    usuarios, 
    clientes,
    etapas, 
    currentUser, 
    temPermissao 
  } = useProcessFlow();

  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedEtapa, setSelectedEtapa] = useState<string>('todas');
  const [selectedVendedor, setSelectedVendedor] = useState<string>('todos');
  const [tipoRelatorio, setTipoRelatorio] = useState<string>('geral');

  // Função para gerar relatório
  const gerarRelatorio = (formato: 'pdf' | 'excel') => {
    toast({
      title: "Relatório gerado",
      description: `Relatório em ${formato.toUpperCase()} foi gerado com sucesso`,
    });
  };

  // Calcular métricas
  const calcularMetricas = () => {
    const processosAtivos = processos.filter(p => p.statusAtual !== etapas.find(e => e.nome === 'Entregue')?.id);
    const processosConcluidos = processos.filter(p => p.statusAtual === etapas.find(e => e.nome === 'Entregue')?.id);
    const faturamentoTotal = processos.reduce((acc, p) => acc + p.valorTotal, 0);
    
    return {
      totalProcessos: processos.length,
      processosAtivos: processosAtivos.length,
      processosConcluidos: processosConcluidos.length,
      faturamentoTotal,
      ticketMedio: processos.length > 0 ? faturamentoTotal / processos.length : 0
    };
  };

  const metricas = calcularMetricas();

  // Gargalos por etapa
  const calcularGargalos = () => {
    return etapas.map(etapa => {
      const processosEtapa = processos.filter(p => p.statusAtual === etapa.id);
      return {
        etapa: etapa.nome,
        quantidade: processosEtapa.length,
        cor: etapa.cor
      };
    });
  };

  const gargalos = calcularGargalos();

  if (!temPermissao('relatorios.todos') && !temPermissao('relatorios.setor')) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-muted-foreground">
                Você não tem permissão para visualizar relatórios.
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
          <h1 className="text-3xl font-bold">Relatórios e Análises</h1>
          <p className="text-muted-foreground">
            Análise completa dos processos e performance do sistema
          </p>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Processos</p>
                <p className="text-2xl font-bold">{metricas.totalProcessos}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processos Ativos</p>
                <p className="text-2xl font-bold">{metricas.processosAtivos}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processos Concluídos</p>
                <p className="text-2xl font-bold">{metricas.processosConcluidos}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Faturamento Total</p>
                <p className="text-2xl font-bold">R$ {metricas.faturamentoTotal.toLocaleString('pt-BR')}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold">R$ {metricas.ticketMedio.toLocaleString('pt-BR')}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Etapa */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Etapa</CardTitle>
            <CardDescription>Quantidade de processos em cada etapa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gargalos.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.cor }}
                    />
                    <span className="text-sm">{item.etapa}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.quantidade}</span>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300"
                        style={{ 
                          width: `${(item.quantidade / metricas.totalProcessos) * 100}%`,
                          backgroundColor: item.cor
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filtros de Relatório */}
        <Card>
          <CardHeader>
            <CardTitle>Gerar Relatório Personalizado</CardTitle>
            <CardDescription>Configure os filtros e gere relatórios detalhados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Relatório</Label>
              <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Relatório Geral</SelectItem>
                  <SelectItem value="vendas">Relatório de Vendas</SelectItem>
                  <SelectItem value="producao">Relatório de Produção</SelectItem>
                  <SelectItem value="gargalos">Análise de Gargalos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Etapa</Label>
              <Select value={selectedEtapa} onValueChange={setSelectedEtapa}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Etapas</SelectItem>
                  {etapas.map(etapa => (
                    <SelectItem key={etapa.id} value={etapa.id}>
                      {etapa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Vendedor</Label>
              <Select value={selectedVendedor} onValueChange={setSelectedVendedor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Vendedores</SelectItem>
                  {usuarios.filter(u => u.role === 'supervisor' || u.role === 'admin').map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={() => gerarRelatorio('excel')}
              >
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button 
                className="flex-1"
                onClick={() => gerarRelatorio('pdf')}
              >
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Processos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Processos Recentes</CardTitle>
          <CardDescription>Últimos processos criados ou atualizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Pedido</th>
                  <th className="text-left p-2">Cliente</th>
                  <th className="text-left p-2">Produto</th>
                  <th className="text-left p-2">Etapa</th>
                  <th className="text-left p-2">Valor</th>
                  <th className="text-left p-2">Data</th>
                </tr>
              </thead>
              <tbody>
                {processos.slice(0, 10).map(processo => (
                  <tr key={processo.id} className="border-b">
                    <td className="p-2 font-medium">{processo.numeroPedido}</td>
                    <td className="p-2">{processo.cliente}</td>
                    <td className="p-2">{processo.produto}</td>
                    <td className="p-2">
                      <span 
                        className="px-2 py-1 rounded-full text-xs text-white"
                        style={{ backgroundColor: etapas.find(e => e.id === processo.statusAtual)?.cor }}
                      >
                        {etapas.find(e => e.id === processo.statusAtual)?.nome}
                      </span>
                    </td>
                    <td className="p-2">R$ {processo.valorTotal.toLocaleString('pt-BR')}</td>
                    <td className="p-2">{processo.dataCriacao.toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;