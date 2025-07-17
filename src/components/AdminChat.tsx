import React, { useState, useEffect, useRef } from 'react';
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
  MessageCircle, 
  Send, 
  Users,
  Clock,
  MessageSquare,
  User,
  CheckCircle,
  Circle
} from 'lucide-react';

const AdminChat: React.FC = () => {
  const { 
    chatMessages, 
    chatConversations, 
    enviarMensagemChat, 
    marcarConversacaoLida,
    currentUser
  } = useProcessFlow();
  const { toast } = useToast();
  const [conversacaoAtiva, setConversacaoAtiva] = useState<string | null>(null);
  const [novaMensagem, setNovaMensagem] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll para o final quando há novas mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, conversacaoAtiva]);

  const conversacaoSelecionada = chatConversations.find(c => c.id === conversacaoAtiva);
  const mensagensDaConversacao = conversacaoSelecionada
    ? chatMessages.filter(m => m.clienteId === conversacaoSelecionada.clienteId)
    : [];

  const handleSelecionarConversacao = (conversacaoId: string) => {
    setConversacaoAtiva(conversacaoId);
    marcarConversacaoLida(conversacaoId);
  };

  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim() || !conversacaoSelecionada) return;

    enviarMensagemChat(conversacaoSelecionada.clienteId, novaMensagem, 'admin');
    setNovaMensagem('');

    toast({
      title: "Mensagem enviada",
      description: `Mensagem enviada para ${conversacaoSelecionada.clienteNome}`
    });
  };

  const totalMensagensNaoLidas = chatConversations.reduce((total, conv) => 
    total + conv.mensagensNaoLidas, 0
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chat Administrativo</h1>
          <p className="text-muted-foreground">
            Gerencie as conversas com os clientes
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          {totalMensagensNaoLidas} mensagens não lidas
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Lista de Conversações */}
        <Card className="border-0 shadow-soft lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Conversas
            </CardTitle>
            <CardDescription>
              {chatConversations.length} conversas ativas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-320px)]">
              {chatConversations.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma conversa ainda</p>
                </div>
              ) : (
                <div className="space-y-1 p-3">
                  {chatConversations
                    .sort((a, b) => b.dataUltimaMensagem.getTime() - a.dataUltimaMensagem.getTime())
                    .map((conversa) => (
                      <div
                        key={conversa.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          conversacaoAtiva === conversa.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => handleSelecionarConversacao(conversa.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <User className="w-8 h-8 p-1 rounded-full bg-muted" />
                              {conversa.ativa && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{conversa.clienteNome}</p>
                              <p className="text-sm opacity-70 truncate">
                                {conversa.ultimaMensagem}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs opacity-70">
                              {conversa.dataUltimaMensagem.toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                            {conversa.mensagensNaoLidas > 0 && (
                              <Badge variant="destructive" className="mt-1 text-xs">
                                {conversa.mensagensNaoLidas}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Área de Chat */}
        <Card className="border-0 shadow-soft lg:col-span-3">
          {conversacaoSelecionada ? (
            <>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {conversacaoSelecionada.clienteNome}
                </CardTitle>
                <CardDescription>
                  Conversa iniciada em {conversacaoSelecionada.dataUltimaMensagem.toLocaleDateString('pt-BR')}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex flex-col h-full p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {mensagensDaConversacao.map((mensagem) => (
                      <div
                        key={mensagem.id}
                        className={`flex ${
                          mensagem.remetente === 'admin' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            mensagem.remetente === 'admin'
                              ? 'bg-primary text-primary-foreground ml-4'
                              : 'bg-muted text-muted-foreground mr-4'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs font-medium">
                              {mensagem.remetente === 'admin' ? currentUser?.nome : mensagem.clienteNome}
                            </p>
                            {mensagem.lida ? (
                              <CheckCircle className="w-3 h-3 opacity-70" />
                            ) : (
                              <Circle className="w-3 h-3 opacity-70" />
                            )}
                          </div>
                          <p className="text-sm">{mensagem.mensagem}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {mensagem.data.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Digite sua mensagem..."
                      value={novaMensagem}
                      onChange={(e) => setNovaMensagem(e.target.value)}
                      className="min-h-[60px] resize-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleEnviarMensagem();
                        }
                      }}
                    />
                    <Button
                      onClick={handleEnviarMensagem}
                      disabled={!novaMensagem.trim()}
                      className="self-end"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Selecione uma conversa</h3>
                <p className="text-muted-foreground">
                  Escolha uma conversa da lista para começar a responder
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminChat;