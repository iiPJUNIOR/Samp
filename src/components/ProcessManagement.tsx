import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProcessFlow } from '@/context/ProcessFlowContext';
import CalendarView from '@/components/ui/calendar-view';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  LayoutGrid,
  List,
  MapPin,
  Clock,
  DollarSign,
  User,
  Package,
  CheckCircle
} from 'lucide-react';
import { Processo, LocalizacaoFisica } from '@/types/processflow';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

type ViewMode = 'kanban' | 'lista' | 'calendario';

const ProcessManagement: React.FC = () => {
  const { 
    processos, 
    etapas, 
    clientes,
    currentUser, 
    temPermissao, 
    criarProcesso, 
    editarProcesso, 
    excluirProcesso, 
    moverProcesso,
    buscarProcessos
  } = useProcessFlow();

  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Processo | null>(null);
  const [formData, setFormData] = useState<any>({});

  // Filtrar processos baseado em permissões
  const getProcessosPermitidos = () => {
    let processosPermitidos = processos;
    
    if (currentUser?.role === 'operador') {
      // Operador só vê processos nas etapas de produção, expedição e entrega
      processosPermitidos = processos.filter(p => {
        const etapa = etapas.find(e => e.id === p.statusAtual);
        return etapa && ['Produção', 'Expedição', 'Entrega'].includes(etapa.nome);
      });
    } else if (currentUser?.role === 'leitor') {
      // Leitor só vê processos dos clientes vinculados a ele
      const clientesPermitidos = currentUser.clientesVinculados || [];
      processosPermitidos = processos.filter(p => clientesPermitidos.includes(p.clienteId));
    }
    
    return searchTerm ? buscarProcessos(searchTerm) : processosPermitidos;
  };

  const processosExibidos = getProcessosPermitidos();

  const initFormData = () => {
    setFormData({
      numeroPedido: '',
      clienteId: '',
      cliente: '',
      vendedorResponsavel: currentUser?.nome || '',
      dataVenda: new Date().toISOString().split('T')[0],
      dataPrimeiroPagamento: '',
      dataPrevistaEntrega: '',
      produto: '',
      quantidade: 1,
      embalagem: '',
      tipoFrete: 'CIF',
      statusAtual: etapas[0]?.id || '',
      localizacaoFisica: 'patio' as LocalizacaoFisica,
      cortesias: [],
      faltas: [],
      observacoes: '',
      prioridade: 'normal',
      valorTotal: 0,
      responsavelAtual: currentUser?.id || '',
      anexos: [],
      tags: []
    });
  };

  const handleCreateProcess = () => {
    if (!temPermissao('processos.criar')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para criar processos",
        variant: "destructive"
      });
      return;
    }

    if (!formData.clienteId) {
      toast({
        title: "Cliente obrigatório",
        description: "Selecione um cliente para criar o processo",
        variant: "destructive"
      });
      return;
    }

    const clienteSelecionado = clientes.find(c => c.id === formData.clienteId);

    criarProcesso({
      ...formData,
      cliente: clienteSelecionado?.nome || '',
      dataVenda: new Date(formData.dataVenda),
      dataPrimeiroPagamento: formData.dataPrimeiroPagamento ? new Date(formData.dataPrimeiroPagamento) : undefined,
      dataPrevistaEntrega: new Date(formData.dataPrevistaEntrega),
      valorTotal: parseFloat(formData.valorTotal) || 0,
      quantidade: parseInt(formData.quantidade) || 1
    });
    
    setShowCreateDialog(false);
    initFormData();
  };

  const handleEditProcess = () => {
    if (!selectedProcess) return;
    
    editarProcesso(selectedProcess.id, {
      ...formData,
      dataVenda: new Date(formData.dataVenda),
      dataPrimeiroPagamento: formData.dataPrimeiroPagamento ? new Date(formData.dataPrimeiroPagamento) : undefined,
      dataPrevistaEntrega: new Date(formData.dataPrevistaEntrega),
      valorTotal: parseFloat(formData.valorTotal) || 0,
      quantidade: parseInt(formData.quantidade) || 1
    });
    
    setShowEditDialog(false);
    setSelectedProcess(null);
  };

  const handleFinalizarProcesso = (processoId: string) => {
    if (!temPermissao('processos.mover')) {
      toast({
        title: "Acesso negado", 
        description: "Você não tem permissão para finalizar processos",
        variant: "destructive"
      });
      return;
    }

    const etapaEntregue = etapas.find(e => e.nome === 'Entregue');
    if (etapaEntregue) {
      moverProcesso(processoId, etapaEntregue.id, 'Processo finalizado pelo operador');
      
      // Criar notificação para admin e supervisor
      toast({
        title: "Processo finalizado",
        description: "Administradores foram notificados",
      });
    }
  };

  const openEditDialog = (processo: Processo) => {
    setSelectedProcess(processo);
    setFormData({
      numeroPedido: processo.numeroPedido,
      clienteId: processo.clienteId,
      cliente: processo.cliente,
      vendedorResponsavel: processo.vendedorResponsavel,
      dataVenda: processo.dataVenda.toISOString().split('T')[0],
      dataPrimeiroPagamento: processo.dataPrimeiroPagamento?.toISOString().split('T')[0] || '',
      dataPrevistaEntrega: processo.dataPrevistaEntrega.toISOString().split('T')[0],
      produto: processo.produto,
      quantidade: processo.quantidade,
      embalagem: processo.embalagem,
      tipoFrete: processo.tipoFrete,
      statusAtual: processo.statusAtual,
      localizacaoFisica: processo.localizacaoFisica,
      observacoes: processo.observacoes,
      prioridade: processo.prioridade,
      valorTotal: processo.valorTotal,
      responsavelAtual: processo.responsavelAtual || ''
    });
    setShowEditDialog(true);
  };

  const getEtapaNome = (etapaId: string) => {
    return etapas.find(e => e.id === etapaId)?.nome || 'Desconhecida';
  };

  const getEtapaCor = (etapaId: string) => {
    return etapas.find(e => e.id === etapaId)?.cor || '#6b7280';
  };

  // Função para handle do drag and drop
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;
    
    const processo = processos.find(p => p.id === draggableId);
    if (!processo) return;
    
    // Verificar permissões para mover processo
    if (!temPermissao('processos.mover')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para mover processos",
        variant: "destructive"
      });
      return;
    }
    
    moverProcesso(draggableId, destination.droppableId, 'Movido via Kanban');
  };

  // Filtrar etapas visíveis para o operador
  const getEtapasVisiveis = () => {
    if (currentUser?.role === 'operador') {
      // Operador só vê as etapas de Produção, Expedição e Entrega
      return etapas.filter(etapa => 
        ['Produção', 'Expedição', 'Entrega'].includes(etapa.nome)
      );
    }
    // Outros usuários veem todas as etapas
    return etapas;
  };

  const etapasVisiveis = getEtapasVisiveis();

  const renderKanbanView = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {etapasVisiveis.map(etapa => {
          const processosEtapa = processosExibidos.filter(p => p.statusAtual === etapa.id);
          
          return (
            <Droppable key={etapa.id} droppableId={etapa.id}>
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-muted/30 rounded-lg p-4 min-h-[200px] transition-colors ${
                    snapshot.isDraggingOver ? 'bg-muted/50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: etapa.cor }}
                      />
                      <h3 className="font-semibold">{etapa.nome}</h3>
                    </div>
                    <Badge variant="secondary">{processosEtapa.length}</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {processosEtapa.map((processo, index) => (
                      <Draggable key={processo.id} draggableId={processo.id} index={index}>
                        {(provided, snapshot) => (
                          <Card 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`cursor-pointer hover:shadow-md transition-shadow ${
                              snapshot.isDragging ? 'shadow-lg rotate-3' : ''
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm">{processo.numeroPedido}</span>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem onClick={() => openEditDialog(processo)}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Editar
                                      </DropdownMenuItem>
                                      {currentUser?.role === 'operador' && (
                                        <DropdownMenuItem onClick={() => handleFinalizarProcesso(processo.id)}>
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Finalizar
                                        </DropdownMenuItem>
                                      )}
                                      {temPermissao('processos.excluir') && (
                                        <DropdownMenuItem 
                                          onClick={() => excluirProcesso(processo.id)}
                                          className="text-destructive"
                                        >
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Excluir
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                
                                <p className="text-sm text-muted-foreground">{processo.cliente}</p>
                                <p className="text-sm">{processo.produto}</p>
                                
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  {processo.localizacaoFisica}
                                </div>
                                
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <DollarSign className="w-3 h-3" />
                                  R$ {processo.valorTotal.toLocaleString('pt-BR')}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {processosExibidos.map(processo => (
        <Card key={processo.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{processo.numeroPedido}</h3>
                  <Badge 
                    style={{ backgroundColor: getEtapaCor(processo.statusAtual) }}
                    className="text-white"
                  >
                    {getEtapaNome(processo.statusAtual)}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{processo.cliente} - {processo.produto}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Qtd: {processo.quantidade}</span>
                  <span>Valor: R$ {processo.valorTotal.toLocaleString('pt-BR')}</span>
                  <span>Local: {processo.localizacaoFisica}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {currentUser?.role === 'operador' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFinalizarProcesso(processo.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Finalizar
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(processo)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Processos</h1>
          <p className="text-muted-foreground">
            Acompanhe e gerencie todos os processos de vendas e produção
          </p>
        </div>
        
        {temPermissao('processos.criar') && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={initFormData}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Processo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Processo</DialogTitle>
                <DialogDescription>
                  Preencha as informações do novo processo de venda
                </DialogDescription>
              </DialogHeader>
              
              <ProcessForm formData={formData} setFormData={setFormData} etapas={etapas} />
              
              <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateProcess}>
                  Criar Processo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filtros e Busca */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por número do pedido, cliente ou vendedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('kanban')}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Kanban
          </Button>
          <Button
            variant={viewMode === 'lista' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('lista')}
          >
            <List className="w-4 h-4 mr-2" />
            Lista
          </Button>
          <Button
            variant={viewMode === 'calendario' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendario')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Calendário
          </Button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      {viewMode === 'kanban' && renderKanbanView()}
      {viewMode === 'lista' && renderListView()}
      {viewMode === 'calendario' && (
        <CalendarView 
          processos={processosExibidos}
          onProcessClick={openEditDialog}
          getEtapaCor={getEtapaCor}
          getEtapaNome={getEtapaNome}
        />
      )}

      {/* Dialog de Edição */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Processo</DialogTitle>
            <DialogDescription>
              Atualize as informações do processo
            </DialogDescription>
          </DialogHeader>
          
          <ProcessForm formData={formData} setFormData={setFormData} etapas={etapas} />
          
          <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditProcess}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente do formulário reutilizável
interface ProcessFormProps {
  formData: any;
  setFormData: (data: any) => void;
  etapas: any[];
}

const ProcessForm: React.FC<ProcessFormProps> = ({ formData, setFormData, etapas }) => {
  const { clientes } = useProcessFlow();
  
  return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
    <div className="space-y-2">
      <Label htmlFor="numeroPedido">Número do Pedido *</Label>
      <Input
        id="numeroPedido"
        value={formData.numeroPedido}
        onChange={(e) => setFormData({ ...formData, numeroPedido: e.target.value })}
        placeholder="Ex: PED-2024-001"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="cliente">Cliente *</Label>
      <Select 
        value={formData.clienteId} 
        onValueChange={(value) => {
          const cliente = clientes.find(c => c.id === value);
          setFormData({ 
            ...formData, 
            clienteId: value,
            cliente: cliente?.nome || '' 
          });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um cliente" />
        </SelectTrigger>
        <SelectContent>
          {clientes.filter(c => c.ativo).map(cliente => (
            <SelectItem key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label htmlFor="vendedorResponsavel">Vendedor Responsável</Label>
      <Input
        id="vendedorResponsavel"
        value={formData.vendedorResponsavel}
        onChange={(e) => setFormData({ ...formData, vendedorResponsavel: e.target.value })}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="dataVenda">Data da Venda</Label>
      <Input
        id="dataVenda"
        type="date"
        value={formData.dataVenda}
        onChange={(e) => setFormData({ ...formData, dataVenda: e.target.value })}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="dataPrevistaEntrega">Data Prevista de Entrega</Label>
      <Input
        id="dataPrevistaEntrega"
        type="date"
        value={formData.dataPrevistaEntrega}
        onChange={(e) => setFormData({ ...formData, dataPrevistaEntrega: e.target.value })}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="produto">Produto</Label>
      <Input
        id="produto"
        value={formData.produto}
        onChange={(e) => setFormData({ ...formData, produto: e.target.value })}
        placeholder="Descrição do produto"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="quantidade">Quantidade</Label>
      <Input
        id="quantidade"
        type="number"
        min="1"
        value={formData.quantidade}
        onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="valorTotal">Valor Total (R$)</Label>
      <Input
        id="valorTotal"
        type="number"
        min="0"
        step="0.01"
        value={formData.valorTotal}
        onChange={(e) => setFormData({ ...formData, valorTotal: e.target.value })}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="statusAtual">Status Atual</Label>
      <Select value={formData.statusAtual} onValueChange={(value) => setFormData({ ...formData, statusAtual: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          {etapas.map(etapa => (
            <SelectItem key={etapa.id} value={etapa.id}>
              {etapa.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label htmlFor="localizacaoFisica">Localização Física</Label>
      <Select value={formData.localizacaoFisica} onValueChange={(value) => setFormData({ ...formData, localizacaoFisica: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione a localização" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="patio">Pátio</SelectItem>
          <SelectItem value="salao">Salão</SelectItem>
          <SelectItem value="rua">Rua</SelectItem>
          <SelectItem value="expedicao">Expedição</SelectItem>
          <SelectItem value="entregue">Entregue</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="col-span-1 md:col-span-2 space-y-2">
      <Label htmlFor="observacoes">Observações</Label>
      <Textarea
        id="observacoes"
        value={formData.observacoes}
        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
        placeholder="Observações sobre o processo..."
        rows={3}
      />
    </div>
  </div>
  );
};

export default ProcessManagement;