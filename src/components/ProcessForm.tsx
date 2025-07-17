import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProcessFlow } from '@/context/ProcessFlowContext';

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

export default ProcessForm;