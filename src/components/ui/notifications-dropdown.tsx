import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Check, Clock, Package } from 'lucide-react';
import { useProcessFlow } from '@/context/ProcessFlowContext';
import { Card } from '@/components/ui/card';
import { Notificacao } from '@/types/processflow';

export function NotificationsDropdown() {
  const { notificacoes, currentUser, marcarNotificacaoLida } = useProcessFlow();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Filtrar notificações para o usuário atual
  const notificacoesUsuario = currentUser ? notificacoes.filter(n => n.usuarioId === currentUser.id) : [];
  
  // Contar notificações não lidas
  const notificacoesNaoLidas = notificacoesUsuario.filter(n => !n.lida).length;
  
  // Ordenar notificações por data (mais recentes primeiro)
  const notificacoesOrdenadas = [...notificacoesUsuario].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Função para formatar a data da notificação
  const formatarData = (data: Date) => {
    const agora = new Date();
    const diff = agora.getTime() - new Date(data).getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    if (minutos < 60) {
      return `${minutos} min atrás`;
    } else if (horas < 24) {
      return `${horas}h atrás`;
    } else if (dias < 7) {
      return `${dias}d atrás`;
    } else {
      return data.toLocaleDateString('pt-BR');
    }
  };

  // Função para obter o ícone da notificação com base no tipo
  const getIconForNotification = (notificacao: Notificacao) => {
    if (notificacao.titulo.includes('Novo Processo')) {
      return <Package className="h-4 w-4 text-primary" />;
    } else if (notificacao.titulo.includes('Movido')) {
      return <Clock className="h-4 w-4 text-info" />;
    } else {
      return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {notificacoesNaoLidas > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            variant="destructive"
          >
            {notificacoesNaoLidas}
          </Badge>
        )}
      </Button>
      
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-semibold">Notificações</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-normal">
                {notificacoesNaoLidas} não lidas
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="max-h-[300px] overflow-auto">
            {notificacoesOrdenadas.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Nenhuma notificação
              </div>
            ) : (
              <div className="divide-y">
                {notificacoesOrdenadas.map((notificacao) => (
                  <div 
                    key={notificacao.id}
                    className={`p-3 cursor-pointer hover:bg-accent/50 ${!notificacao.lida ? 'bg-muted/50' : ''}`}
                    onClick={() => {
                      marcarNotificacaoLida(notificacao.id);
                    }}
                  >
                    <div className="flex gap-3 w-full">
                      <div className="flex-shrink-0 mt-1">
                        {getIconForNotification(notificacao)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {notificacao.titulo}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatarData(notificacao.data)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {notificacao.mensagem}
                        </p>
                        {!notificacao.lida && (
                          <div className="flex justify-end">
                            <Badge variant="secondary" className="text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              Marcar como lida
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}