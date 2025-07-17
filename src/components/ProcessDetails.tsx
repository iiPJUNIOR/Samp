import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProcessFlow } from '@/context/ProcessFlowContext';
import { Processo } from '@/types/processflow';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  Package, 
  User, 
  Truck, 
  ClipboardList,
  Edit
} from 'lucide-react';

interface ProcessDetailsProps {
  processo: Processo | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (processo: Processo) => void;
}

const ProcessDetails: React.FC<ProcessDetailsProps> = ({ 
  processo, 
  isOpen, 
  onClose,
  onEdit
}) => {
  const { etapas, temPermissao } = useProcessFlow();

  if (!processo) return null;

  const etapaAtual = etapas.find(e => e.id === processo.statusAtual);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Detalhes do Processo</DialogTitle>
            <Badge 
              style={{ backgroundColor: etapaAtual?.cor || '#6b7280' }}
              className="text-white"
            >
              {etapaAtual?.nome || 'Desconhecido'}
            </Badge>
          </div>
          <DialogDescription>
            Pedido {processo.numeroPedido} - {processo.cliente}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Informações do Pedido</h3>
              
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{processo.produto}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span>R$ {processo.valorTotal.toLocaleString('pt-BR')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-muted-foreground" />
                <span>Quantidade: {processo.quantidade}</span>
              </div>
              
              {processo.embalagem && (
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span>Embalagem: {processo.embalagem}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-muted-foreground" />
                <span>Frete: {processo.tipoFrete}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Datas e Responsáveis</h3>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Vendedor: {processo.vendedorResponsavel}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Data da Venda: {formatDate(processo.dataVenda)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Previsão de Entrega: {formatDate(processo.dataPrevistaEntrega)}</span>
              </div>
              
              {processo.dataEntregaRealizada && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-success" />
                  <span>Entregue em: {formatDate(processo.dataEntregaRealizada)}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>Localização: {processo.localizacaoFisica}</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Observações */}
          {processo.observacoes && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Observações</h3>
              <p className="text-sm bg-muted/30 p-3 rounded-md">{processo.observacoes}</p>
            </div>
          )}
          
          {/* Histórico */}
          {processo.historico && processo.historico.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Histórico de Movimentações</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {processo.historico
                  .sort((a, b) => b.data.getTime() - a.data.getTime())
                  .map((item) => {
                    const etapaAnterior = etapas.find(e => e.id === item.etapaAnterior);
                    const etapaNova = etapas.find(e => e.id === item.etapaNova);
                    
                    return (
                      <div key={item.id} className="text-xs bg-muted/30 p-2 rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.usuarioNome}</span>
                          <span className="text-muted-foreground">
                            {item.data.toLocaleDateString('pt-BR')} {item.data.toLocaleTimeString('pt-BR')}
                          </span>
                        </div>
                        <p>
                          Movido de <span className="font-medium">{etapaAnterior?.nome || 'Desconhecido'}</span> para{' '}
                          <span className="font-medium">{etapaNova?.nome || 'Desconhecido'}</span>
                        </p>
                        {item.comentario && <p className="text-muted-foreground mt-1">{item.comentario}</p>}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {temPermissao('processos.editar') && onEdit && (
            <Button variant="outline" onClick={() => onEdit(processo)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar Processo
            </Button>
          )}
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessDetails;