import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProcessFlow } from '@/context/ProcessFlowContext';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Users,
  Package,
  Calendar,
  Activity,
  Info
} from 'lucide-react';
import SystemStatus from './SystemStatus';
import ProcessDetails from './ProcessDetails';
import ProcessForm from './ProcessForm';
import DemoRealTimeUpdates from './DemoRealTimeUpdates';
import { Processo } from '@/types/processflow';

const Dashboard: React.FC = () => {
  const { metricas, processos, etapas, currentUser, editarProcesso } = useProcessFlow();
  const [periodo, setPeriodo] = useState('mes');
  const [selectedProcess, setSelectedProcess] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!metricas) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Filtrar processos por período
  const filtrarPorPeriodo = (processos: Processo[]) => {
    const hoje = new Date();
    let dataInicio = new Date();
    
    switch (periodo) {
      case 'semana':
        dataInicio.setDate(hoje.getDate() - 7); // 7 dias atrás
        break;
      case 'mes':
        dataInicio.setDate(hoje.getDate() - 30); // 30 dias atrás
        break;
      case 'trimestre':
        dataInicio.setDate(hoje.getDate() - 90); // 90 dias atrás
        break;
      default:
        dataInicio.setDate(hoje.getDate() - 30); // Padrão: 30 dias
    }
    
    return processos.filter(p => new Date(p.dataAtualizacao) >= dataInicio);
  };

  // Para operador: filtrar apenas processos em suas etapas permitidas
  const processosOperador = currentUser?.role === 'operador' 
    ? processos.filter(p => {
        const etapa = etapas.find(e => e.id === p.statusAtual);
        return etapa && ['Produção', 'Expedição', 'Entrega'].includes(etapa.nome);
      })
    : processos;
  
  // Aplicar filtro de período
  const processosFiltrados = filtrarPorPeriodo(currentUser?.role === 'operador' ? processosOperador : processos);

  const processosRecentes = processosFiltrados
    .sort((a, b) => new Date(b.dataAtualizacao).getTime() - new Date(a.dataAtualizacao).getTime())
    .slice(0, 5);

  const processosAtrasados = processosFiltrados
    .filter(p => p.dataPrevistaEntrega < new Date() && !p.dataEntregaRealizada);

  // Métricas específicas para operador
  const getMetricasOperador = () => {
    const totalProcessosOperador = processosOperador.length;
    
    // Calcular tempo médio dos processos que chegaram às etapas do operador
    const processosComTempo = processosOperador.filter(p => {
      const etapa = etapas.find(e => e.id === p.statusAtual);
      return etapa && p.dataVenda; // Apenas processos com data de venda
    });
    
    const tempoMedioOperador = processosComTempo.length > 0 
      ? Math.round(processosComTempo.reduce((acc, p) => {
          const diasDesdeVenda = Math.floor(
            (new Date().getTime() - new Date(p.dataVenda).getTime()) / (1000 * 60 * 60 * 24)
          );
          return acc + diasDesdeVenda;
        }, 0) / processosComTempo.length)
      : 0;

    return {
      totalProcessos: totalProcessosOperador,
      tempoMedio: tempoMedioOperador
    };
  };

  const metricasOperador = currentUser?.role === 'operador' ? getMetricasOperador() : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {currentUser?.nome}! Visão geral dos seus processos.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={periodo === 'semana' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriodo('semana')}
          >
            7 dias
          </Button>
          <Button 
            variant={periodo === 'mes' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriodo('mes')}
          >
            30 dias
          </Button>
          <Button 
            variant={periodo === 'trimestre' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriodo('trimestre')}
          >
            90 dias
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      {currentUser?.role === 'operador' ? (
        // Dashboard simplificado para operador
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Processos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metricasOperador?.totalProcessos || 0}</div>
              <p className="text-xs text-muted-foreground">
                Processos sob sua responsabilidade
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metricasOperador?.tempoMedio || 0} dias</div>
              <p className="text-xs text-muted-foreground">
                Desde que chegou para você
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Dashboard completo para outros roles
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Processos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metricas.totalProcessos}</div>
              <p className="text-xs text-muted-foreground">
                {metricas.processosAtivos} ativos • {metricas.processosConcluidos} concluídos
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {metricas.faturamentoMes.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metricas.tempoMedioProcesso} dias</div>
              <p className="text-xs text-muted-foreground">
                Do lead à entrega
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metricas.conversaoLeadVenda}%</div>
              <p className="text-xs text-muted-foreground">
                Lead para venda
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Conteúdo principal */}
      <Tabs defaultValue="visao-geral" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="atrasados">Atrasados</TabsTrigger>
          <TabsTrigger value="recentes">Recentes</TabsTrigger>
          <TabsTrigger value="sistema" className="bg-gradient-primary text-primary-foreground data-[state=active]:bg-gradient-primary">
            <Info className="w-4 h-4 mr-1" />
            Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-4">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Processos por Etapa
              </CardTitle>
              <CardDescription>
                Distribuição atual do pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {etapas.map((etapa) => {
                  // Calcular a quantidade de processos em tempo real para cada etapa
                  const processosFiltradosPorEtapa = processosFiltrados.filter(p => p.statusAtual === etapa.id);
                  const quantidade = processosFiltradosPorEtapa.length;
                  
                  return (
                    <div 
                      key={etapa.id} 
                      className="flex flex-col items-center justify-center p-4 rounded-lg border"
                      style={{ 
                        background: `linear-gradient(135deg, ${etapa.cor}10, ${etapa.cor}20)`,
                        borderColor: `${etapa.cor}30` 
                      }}
                    >
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                        style={{ 
                          backgroundColor: etapa.cor || '#64748B',
                          boxShadow: `0 4px 12px ${etapa.cor}40`
                        }}
                      >
                        <span className="text-2xl font-bold text-white">
                          {quantidade}
                        </span>
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium text-sm">{etapa.nome}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>



        <TabsContent value="atrasados" className="space-y-4">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-destructive" />
                Processos Atrasados
              </CardTitle>
              <CardDescription>
                {processosAtrasados.length} processos com entrega em atraso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {processosAtrasados.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
                    <p className="text-muted-foreground">Nenhum processo atrasado!</p>
                  </div>
                ) : (
                  processosAtrasados.map((processo) => {
                    const diasAtraso = Math.floor(
                      (new Date().getTime() - processo.dataPrevistaEntrega.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div 
                        key={processo.id} 
                        className="p-3 border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => {
                          setSelectedProcess(processo);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{processo.numeroPedido}</span>
                          <Badge variant="destructive">{diasAtraso} dias</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{processo.cliente}</p>
                        <p className="text-xs text-muted-foreground">
                          Previsão: {processo.dataPrevistaEntrega.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recentes" className="space-y-4">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Atividades Recentes
              </CardTitle>
              <CardDescription>
                Últimas atualizações de processos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {processosRecentes.map((processo) => {
                  const etapa = etapas.find(e => e.id === processo.statusAtual);
                  return (
                    <div 
                      key={processo.id} 
                      className="p-3 border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => {
                        setSelectedProcess(processo);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{processo.numeroPedido}</span>
                        <Badge 
                          variant="secondary"
                          style={{ backgroundColor: etapa?.cor + '20', color: etapa?.cor }}
                        >
                          {etapa?.nome}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{processo.cliente}</p>
                      <p className="text-xs text-muted-foreground">
                        Atualizado: {processo.dataAtualizacao.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sistema" className="space-y-4">
          <SystemStatus />
        </TabsContent>
      </Tabs>

      {/* Modal de detalhes do processo */}
      <ProcessDetails 
        processo={selectedProcess}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={(processo) => {
          setIsDetailsOpen(false);
          setSelectedProcess(processo);
          setIsEditOpen(true);
        }}
      />
      
      {/* Modal de edição do processo */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Processo</DialogTitle>
            <DialogDescription>
              Atualize as informações do processo {selectedProcess?.numeroPedido}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProcess && (
            <ProcessForm 
              formData={selectedProcess} 
              setFormData={setSelectedProcess} 
              etapas={etapas} 
            />
          )}
          
          <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              if (selectedProcess) {
                editarProcesso(selectedProcess.id, {
                  ...selectedProcess,
                  dataVenda: new Date(selectedProcess.dataVenda),
                  dataPrimeiroPagamento: selectedProcess.dataPrimeiroPagamento ? new Date(selectedProcess.dataPrimeiroPagamento) : undefined,
                  dataPrevistaEntrega: new Date(selectedProcess.dataPrevistaEntrega),
                  valorTotal: parseFloat(selectedProcess.valorTotal) || 0,
                  quantidade: parseInt(selectedProcess.quantidade) || 1
                });
                setIsEditOpen(false);
              }
            }}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;