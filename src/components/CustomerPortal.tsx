import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProcessFlow } from '@/context/ProcessFlowContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  Package, 
  MessageCircle, 
  Send, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const CustomerPortal: React.FC = () => {
  const { 
    currentUser, 
    processos, 
    etapas, 
    clientes,
    chatMessages,
    enviarMensagemChat 
  } = useProcessFlow();
  const { toast } = useToast();
  const [chatMessage, setChatMessage] = useState('');

  // Encontrar cliente vinculado ao usuário leitor
  const clienteVinculado = clientes.find(c => 
    currentUser?.clientesVinculados?.includes(c.id)
  );

  // Filtrar processos do cliente
  const processosCliente = processos.filter(p => 
    p.clienteId === clienteVinculado?.id
  );

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !clienteVinculado) return;

    enviarMensagemChat(clienteVinculado.id, chatMessage, 'cliente');
    setChatMessage('');

    toast({
      title: "Mensagem enviada",
      description: "Nossa equipe entrará em contato em breve"
    });
  };

  const getStatusIcon = (statusId: string) => {
    const etapa = etapas.find(e => e.id === statusId);
    if (!etapa) return <Package className="w-4 h-4" />;
    
    switch (etapa.nome) {
      case 'Concluído':
      case 'Entregue':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'Cancelado':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Info className="w-4 h-4 text-info" />;
    }
  };

  const calcularDiasRestantes = (dataPrevisao: Date) => {
    const hoje = new Date();
    const diferenca = dataPrevisao.getTime() - hoje.getTime();
    const dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24));
    return dias;
  };

  if (!clienteVinculado) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
          <p className="text-muted-foreground">
            Você não possui acesso a nenhum cliente no momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Portal do Cliente</h1>
          <p className="text-muted-foreground">
            Acompanhe seus pedidos e entre em contato conosco
          </p>
        </div>
        <Badge className="w-fit bg-gradient-primary text-primary-foreground">
          {clienteVinculado.nome}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Cliente */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Nome</Label>
                <p className="text-sm">{clienteVinculado.nome}</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm">{clienteVinculado.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Telefone</Label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm">{clienteVinculado.telefone}</p>
                </div>
              </div>
              
              {clienteVinculado.endereco && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Endereço</Label>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{clienteVinculado.endereco}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat */}
          <Card className="border-0 shadow-soft mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Fale Conosco
              </CardTitle>
              <CardDescription>
                Envie uma mensagem para nossa equipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-48 border rounded p-3">
                <div className="space-y-3">
                  {!clienteVinculado && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-2 rounded-lg text-sm bg-muted text-muted-foreground mr-4">
                        <p className="text-xs font-medium mb-1">Sistema</p>
                        <p>Bem-vindo ao portal do cliente! Como podemos ajudá-lo hoje?</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )}
                  {clienteVinculado && chatMessages
                    .filter(msg => msg.clienteId === clienteVinculado.id)
                    .map((msg) => (
                      <div key={msg.id} className={`flex ${msg.remetente === 'cliente' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                          msg.remetente === 'cliente' 
                            ? 'bg-primary text-primary-foreground ml-4'
                            : 'bg-accent text-accent-foreground mr-4'
                        }`}>
                          <p className="text-xs font-medium mb-1">
                            {msg.remetente === 'cliente' ? msg.clienteNome : 'Atendimento'}
                          </p>
                          <p>{msg.mensagem}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {msg.data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
              
              <div className="space-y-2">
                <Textarea
                  placeholder="Digite sua mensagem..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="w-full"
                  disabled={!chatMessage.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Mensagem
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pedidos do Cliente */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Seus Pedidos
              </CardTitle>
              <CardDescription>
                Acompanhe o status dos seus pedidos em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              {processosCliente.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum pedido encontrado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {processosCliente.map((processo) => {
                    const etapa = etapas.find(e => e.id === processo.statusAtual);
                    const diasRestantes = calcularDiasRestantes(processo.dataPrevistaEntrega);
                    const isAtrasado = diasRestantes < 0;
                    const isConcluido = etapa?.nome === 'Concluído' || etapa?.nome === 'Entregue';
                    
                    return (
                      <div key={processo.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(processo.statusAtual)}
                            <div>
                              <h3 className="font-medium">Pedido #{processo.numeroPedido}</h3>
                              <p className="text-sm text-muted-foreground">{processo.produto}</p>
                            </div>
                          </div>
                          <Badge 
                            variant="secondary"
                            style={{ 
                              backgroundColor: etapa?.cor + '20', 
                              color: etapa?.cor,
                              borderColor: etapa?.cor + '40'
                            }}
                          >
                            {etapa?.nome || 'Status Indefinido'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Data do Pedido</p>
                              <p className="text-muted-foreground">
                                {new Date(processo.dataVenda).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Previsão de Entrega</p>
                              <p className={`${isAtrasado && !isConcluido ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {processo.dataPrevistaEntrega.toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Situação</p>
                              <p className={`${
                                isConcluido ? 'text-success' :
                                isAtrasado ? 'text-destructive' :
                                diasRestantes <= 3 ? 'text-warning' :
                                'text-muted-foreground'
                              }`}>
                                {isConcluido ? 'Concluído' :
                                 isAtrasado ? `${Math.abs(diasRestantes)} dias em atraso` :
                                 diasRestantes <= 3 ? `${diasRestantes} dias restantes` :
                                 `${diasRestantes} dias restantes`}
                              </p>
                            </div>
                          </div>
                        </div>

                        {processo.observacoes && (
                          <div className="pt-2 border-t">
                            <p className="text-sm font-medium mb-1">Observações:</p>
                            <p className="text-sm text-muted-foreground">{processo.observacoes}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal;