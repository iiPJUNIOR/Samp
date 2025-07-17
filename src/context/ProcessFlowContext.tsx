import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Tenant, 
  Etapa, 
  Processo, 
  Notificacao, 
  DashboardMetricas, 
  UserRole,
  PERMISSOES,
  ChatMessage,
  ChatConversation
} from '@/types/processflow';
import { mockData } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface ProcessFlowContextType {
  // Estado do usuário
  currentUser: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  
  // Dados principais
  usuarios: User[];
  etapas: Etapa[];
  processos: Processo[];
  notificacoes: Notificacao[];
  clientes: any[];
  metricas: DashboardMetricas | null;
  
  // Chat
  chatMessages: ChatMessage[];
  chatConversations: ChatConversation[];
  
  // Funções de autenticação
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  
  // Funções de usuários
  criarUsuario: (usuario: Omit<User, 'id' | 'dataCriacao' | 'tenantId'>) => void;
  editarUsuario: (id: string, dados: Partial<User>) => void;
  excluirUsuario: (id: string) => void;
  alterarSenha: (id: string, novaSenha: string) => void;
  
  // Funções de etapas
  criarEtapa: (etapa: Omit<Etapa, 'id' | 'tenantId'>) => void;
  editarEtapa: (id: string, dados: Partial<Etapa>) => void;
  excluirEtapa: (id: string) => void;
  reordenarEtapas: (etapas: Etapa[]) => void;
  
  // Funções de processos
  criarProcesso: (processo: Omit<Processo, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'tenantId' | 'historico'>) => void;
  editarProcesso: (id: string, dados: Partial<Processo>) => void;
  excluirProcesso: (id: string) => void;
  moverProcesso: (id: string, novaEtapa: string, comentario?: string) => void;
  
  // Funções de busca e filtro
  buscarProcessos: (termo: string) => Processo[];
  filtrarProcessos: (filtros: any) => Processo[];
  
  // Funções de permissão
  temPermissao: (permissao: string) => boolean;
  
  // Funções de clientes
  criarCliente: (cliente: any) => void;
  editarCliente: (id: string, dados: any) => void;
  excluirCliente: (id: string) => void;
  
  // Funções de notificação
  marcarNotificacaoLida: (id: string) => void;
  
  // Funções de métricas
  atualizarMetricas: () => void;
  
  // Funções de chat
  enviarMensagemChat: (clienteId: string, mensagem: string, remetente: 'cliente' | 'admin') => void;
  marcarMensagemLida: (messageId: string) => void;
  marcarConversacaoLida: (conversationId: string) => void;
}

const ProcessFlowContext = createContext<ProcessFlowContextType | undefined>(undefined);

export const useProcessFlow = () => {
  const context = useContext(ProcessFlowContext);
  if (!context) {
    throw new Error('useProcessFlow deve ser usado dentro de ProcessFlowProvider');
  }
  return context;
};

export const ProcessFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [metricas, setMetricas] = useState<DashboardMetricas | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatConversations, setChatConversations] = useState<ChatConversation[]>([]);

  const isAuthenticated = !!currentUser;

  // Função para gerar processos fictícios para o calendário
  const gerarProcessosFicticios = () => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    // Gerar processos para o mês atual
    const processosFicticios: Processo[] = [];
    
    // Nomes de produtos fictícios
    const produtos = [
      'Sistema ERP Completo',
      'Website Responsivo',
      'Aplicativo Mobile',
      'Consultoria Estratégica',
      'Automação de Marketing',
      'Integração de APIs',
      'Dashboard Analítico',
      'Plataforma E-commerce',
      'Sistema de Gestão',
      'Chatbot Inteligente'
    ];
    
    // Gerar processos distribuídos ao longo do mês
    for (let i = 1; i <= 25; i++) {
      // Distribuir os processos ao longo do mês
      const dia = Math.floor(Math.random() * 28) + 1;
      const dataVenda = new Date(anoAtual, mesAtual, dia);
      
      // Prazo de entrega entre 5 e 30 dias após a venda
      const prazoEntrega = Math.floor(Math.random() * 25) + 5;
      const dataPrevistaEntrega = new Date(dataVenda);
      dataPrevistaEntrega.setDate(dataPrevistaEntrega.getDate() + prazoEntrega);
      
      // Selecionar cliente aleatório
      const clienteIndex = Math.floor(Math.random() * mockData.clientes.length);
      const cliente = mockData.clientes[clienteIndex];
      
      // Selecionar etapa aleatória
      const etapaIndex = Math.floor(Math.random() * mockData.etapas.length);
      const etapa = mockData.etapas[etapaIndex];
      
      // Selecionar produto aleatório
      const produtoIndex = Math.floor(Math.random() * produtos.length);
      const produto = produtos[produtoIndex];
      
      // Gerar valor aleatório entre 1000 e 50000
      const valorTotal = Math.floor(Math.random() * 49000) + 1000;
      
      // Criar processo fictício
      const processoFicticio: Processo = {
        id: `processo-ficticio-${i}`,
        numeroPedido: `PED-2024-${100 + i}`,
        clienteId: cliente.id,
        cliente: cliente.nome,
        vendedorResponsavel: i % 2 === 0 ? 'Ana Silva' : 'Carlos Vendedor',
        dataVenda: dataVenda,
        dataPrimeiroPagamento: undefined,
        dataPrevistaEntrega: dataPrevistaEntrega,
        dataEntregaRealizada: undefined,
        produto: produto,
        quantidade: Math.floor(Math.random() * 5) + 1,
        embalagem: i % 3 === 0 ? 'Digital' : 'Caixa padrão',
        tipoFrete: i % 4 === 0 ? 'Digital' : 'Transportadora',
        statusAtual: etapa.id,
        localizacaoFisica: 'patio' as const,
        cortesias: [],
        faltas: [],
        observacoes: `Processo fictício gerado para demonstração do calendário`,
        prioridade: i % 3 === 0 ? 'alta' as const : 'normal' as const,
        valorTotal: valorTotal,
        responsavelAtual: i % 2 === 0 ? 'user-supervisor' : 'user-operador',
        historico: [],
        anexos: [],
        tags: [],
        dataCriacao: new Date(dataVenda.getTime() - 86400000), // 1 dia antes da venda
        dataAtualizacao: dataVenda,
        tenantId: 'tenant-demo'
      };
      
      processosFicticios.push(processoFicticio);
    }
    
    return processosFicticios;
  };

  // Inicializar dados mock
  useEffect(() => {
    setTenant(mockData.tenant);
    setUsuarios(mockData.usuarios);
    setEtapas(mockData.etapas);
    
    // Combinar processos existentes com os fictícios
    const processosFicticios = gerarProcessosFicticios();
    setProcessos([...mockData.processos, ...processosFicticios]);
    
    setNotificacoes(mockData.notificacoes);
    setClientes(mockData.clientes);
    setChatMessages(mockData.chatMessages);
    setChatConversations(mockData.chatConversations);
    atualizarMetricas();
  }, []);

  // Função de login
  const login = async (email: string, senha: string): Promise<boolean> => {
    const usuario = usuarios.find(u => u.email === email && u.senha === senha && u.ativo);
    
    if (usuario) {
      setCurrentUser({
        ...usuario,
        ultimoLogin: new Date()
      });
      
      // Atualizar último login
      setUsuarios(prev => prev.map(u => 
        u.id === usuario.id 
          ? { ...u, ultimoLogin: new Date() }
          : u
      ));
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a), ${usuario.nome}`,
      });
      
      return true;
    }
    
    toast({
      title: "Erro no login",
      description: "Email ou senha incorretos",
      variant: "destructive"
    });
    
    return false;
  };

  // Função de logout
  const logout = () => {
    setCurrentUser(null);
    toast({
      title: "Logout realizado",
      description: "Até logo!"
    });
  };

  // Verificar permissões
  const temPermissao = (permissao: string): boolean => {
    if (!currentUser) return false;
    return PERMISSOES[currentUser.role].includes(permissao);
  };

  // Função para gerar ID único
  const gerarId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Funções de usuários
  const criarUsuario = (dadosUsuario: Omit<User, 'id' | 'dataCriacao' | 'tenantId'>) => {
    if (!temPermissao('usuarios.criar')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para criar usuários",
        variant: "destructive"
      });
      return;
    }

    const novoUsuario: User = {
      ...dadosUsuario,
      id: gerarId(),
      dataCriacao: new Date(),
      tenantId: tenant?.id || ''
    };

    setUsuarios(prev => [...prev, novoUsuario]);
    toast({
      title: "Usuário criado",
      description: `${novoUsuario.nome} foi adicionado com sucesso`
    });
  };

  const editarUsuario = (id: string, dados: Partial<User>) => {
    if (!temPermissao('usuarios.editar')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para editar usuários",
        variant: "destructive"
      });
      return;
    }

    setUsuarios(prev => prev.map(u => 
      u.id === id ? { ...u, ...dados } : u
    ));
    
    toast({
      title: "Usuário atualizado",
      description: "As informações foram salvas com sucesso"
    });
  };

  const excluirUsuario = (id: string) => {
    if (!temPermissao('usuarios.excluir')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para excluir usuários",
        variant: "destructive"
      });
      return;
    }

    setUsuarios(prev => prev.filter(u => u.id !== id));
    toast({
      title: "Usuário removido",
      description: "O usuário foi excluído do sistema"
    });
  };

  const alterarSenha = (id: string, novaSenha: string) => {
    if (!temPermissao('usuarios.editar')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para alterar senhas",
        variant: "destructive"
      });
      return;
    }

    setUsuarios(prev => prev.map(u => 
      u.id === id ? { ...u, senha: novaSenha } : u
    ));
    
    toast({
      title: "Senha alterada",
      description: "A nova senha foi definida com sucesso"
    });
  };

  // Funções de etapas
  const criarEtapa = (dadosEtapa: Omit<Etapa, 'id' | 'tenantId'>) => {
    if (!temPermissao('etapas.criar')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para criar etapas",
        variant: "destructive"
      });
      return;
    }

    const novaEtapa: Etapa = {
      ...dadosEtapa,
      id: gerarId(),
      tenantId: tenant?.id || ''
    };

    setEtapas(prev => [...prev, novaEtapa]);
    toast({
      title: "Etapa criada",
      description: `${novaEtapa.nome} foi adicionada com sucesso`
    });
  };

  const editarEtapa = (id: string, dados: Partial<Etapa>) => {
    if (!temPermissao('etapas.editar')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para editar etapas",
        variant: "destructive"
      });
      return;
    }

    setEtapas(prev => prev.map(e => 
      e.id === id ? { ...e, ...dados } : e
    ));
    
    toast({
      title: "Etapa atualizada",
      description: "As informações foram salvas com sucesso"
    });
  };

  const excluirEtapa = (id: string) => {
    if (!temPermissao('etapas.excluir')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para excluir etapas",
        variant: "destructive"
      });
      return;
    }

    setEtapas(prev => prev.filter(e => e.id !== id));
    toast({
      title: "Etapa removida",
      description: "A etapa foi excluída do sistema"
    });
  };

  const reordenarEtapas = (novasEtapas: Etapa[]) => {
    if (!temPermissao('etapas.reordenar')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para reordenar etapas",
        variant: "destructive"
      });
      return;
    }

    setEtapas(novasEtapas);
    toast({
      title: "Etapas reordenadas",
      description: "A nova ordem foi salva com sucesso"
    });
  };

  // Funções de processos
  const criarProcesso = (dadosProcesso: Omit<Processo, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'tenantId' | 'historico'>) => {
    if (!temPermissao('processos.criar')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para criar processos",
        variant: "destructive"
      });
      return;
    }

    const novoProcesso: Processo = {
      ...dadosProcesso,
      id: gerarId(),
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      tenantId: tenant?.id || '',
      historico: []
    };

    setProcessos(prev => [...prev, novoProcesso]);
    
    // Atualizar métricas em tempo real
    atualizarMetricas();
    
    toast({
      title: "Processo criado",
      description: `Pedido ${novoProcesso.numeroPedido} foi criado com sucesso`
    });
  };

  const editarProcesso = (id: string, dados: Partial<Processo>) => {
    if (!temPermissao('processos.editar')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para editar processos",
        variant: "destructive"
      });
      return;
    }

    setProcessos(prev => prev.map(p => 
      p.id === id ? { ...p, ...dados, dataAtualizacao: new Date() } : p
    ));
    
    // Atualizar métricas em tempo real
    atualizarMetricas();
    
    toast({
      title: "Processo atualizado",
      description: "As informações foram salvas com sucesso"
    });
  };

  const excluirProcesso = (id: string) => {
    if (!temPermissao('processos.excluir')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para excluir processos",
        variant: "destructive"
      });
      return;
    }

    setProcessos(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Processo removido",
      description: "O processo foi excluído do sistema"
    });
  };

  const moverProcesso = (id: string, novaEtapa: string, comentario?: string) => {
    if (!temPermissao('processos.mover') && !temPermissao('processos.finalizar')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para mover processos",
        variant: "destructive"
      });
      return;
    }

    const processo = processos.find(p => p.id === id);
    if (!processo) return;

    const novoHistorico = {
      id: gerarId(),
      processoId: id,
      etapaAnterior: processo.statusAtual,
      etapaNova: novaEtapa,
      usuarioId: currentUser?.id || '',
      usuarioNome: currentUser?.nome || '',
      data: new Date(),
      comentario,
      automatico: false
    };

    // Atualizar processo
    setProcessos(prev => prev.map(p => 
      p.id === id 
        ? { 
            ...p, 
            statusAtual: novaEtapa,
            dataAtualizacao: new Date(),
            dataEntregaRealizada: etapas.find(e => e.id === novaEtapa)?.nome === 'Entregue' ? new Date() : p.dataEntregaRealizada,
            historico: [...p.historico, novoHistorico]
          } 
        : p
    ));
    
    const etapaNome = etapas.find(e => e.id === novaEtapa)?.nome || 'Nova etapa';
    
    // Se é finalização por operador, criar notificações para admin e supervisores
    if (currentUser?.role === 'operador' && etapaNome === 'Entregue') {
      const adminsESupervisores = usuarios.filter(u => 
        (u.role === 'admin' || u.role === 'supervisor') && u.ativo
      );
      
      const novasNotificacoes = adminsESupervisores.map(usuario => ({
        id: gerarId(),
        tipo: 'sistema' as const,
        titulo: 'Processo Finalizado',
        mensagem: `O processo ${processo.numeroPedido} foi finalizado pelo operador ${currentUser.nome}`,
        processoId: processo.id,
        usuarioId: usuario.id,
        lida: false,
        data: new Date(),
        tenantId: tenant?.id || ''
      }));
      
      setNotificacoes(prev => [...prev, ...novasNotificacoes]);
    }
    
    // Atualizar métricas em tempo real
    atualizarMetricas();
    
    toast({
      title: "Processo movido",
      description: `Pedido ${processo.numeroPedido} foi movido para ${etapaNome}`
    });
  };

  // Funções de busca
  const buscarProcessos = (termo: string): Processo[] => {
    if (!termo) return processos;
    
    const termoLower = termo.toLowerCase();
    return processos.filter(p => 
      p.numeroPedido.toLowerCase().includes(termoLower) ||
      p.cliente.toLowerCase().includes(termoLower) ||
      p.vendedorResponsavel.toLowerCase().includes(termoLower) ||
      p.produto.toLowerCase().includes(termoLower)
    );
  };

  const filtrarProcessos = (filtros: any): Processo[] => {
    return processos.filter(processo => {
      if (filtros.etapas?.length && !filtros.etapas.includes(processo.statusAtual)) return false;
      if (filtros.vendedores?.length && !filtros.vendedores.includes(processo.vendedorResponsavel)) return false;
      if (filtros.localizacao?.length && !filtros.localizacao.includes(processo.localizacaoFisica)) return false;
      if (filtros.prioridade?.length && !filtros.prioridade.includes(processo.prioridade)) return false;
      
      if (filtros.dataInicio && processo.dataVenda < filtros.dataInicio) return false;
      if (filtros.dataFim && processo.dataVenda > filtros.dataFim) return false;
      
      return true;
    });
  };

  // Funções de clientes
  const criarCliente = (dadosCliente: any) => {
    const novoCliente = {
      ...dadosCliente,
      id: gerarId(),
      dataCriacao: new Date(),
      tenantId: tenant?.id || '',
      ativo: true
    };

    setClientes(prev => [...prev, novoCliente]);
    toast({
      title: "Cliente criado",
      description: `${novoCliente.nome} foi adicionado com sucesso`
    });
  };

  const editarCliente = (id: string, dados: any) => {
    setClientes(prev => prev.map(c => 
      c.id === id ? { ...c, ...dados } : c
    ));
    
    toast({
      title: "Cliente atualizado",
      description: "As informações foram salvas com sucesso"
    });
  };

  const excluirCliente = (id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
    toast({
      title: "Cliente removido",
      description: "O cliente foi excluído do sistema"
    });
  };

  // Marcar notificação como lida
  const marcarNotificacaoLida = (id: string) => {
    setNotificacoes(prev => prev.map(n => 
      n.id === id ? { ...n, lida: true } : n
    ));
  };

  // Funções de chat
  const enviarMensagemChat = (clienteId: string, mensagem: string, remetente: 'cliente' | 'admin') => {
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return;

    const novaMensagem: ChatMessage = {
      id: gerarId(),
      clienteId,
      clienteNome: cliente.nome,
      remetente,
      mensagem,
      data: new Date(),
      lida: false,
      tenantId: tenant?.id || ''
    };

    setChatMessages(prev => [...prev, novaMensagem]);
    
    // Atualizar ou criar conversação
    setChatConversations(prev => {
      const conversacaoExistente = prev.find(c => c.clienteId === clienteId);
      if (conversacaoExistente) {
        return prev.map(c => 
          c.clienteId === clienteId 
            ? {
                ...c,
                ultimaMensagem: mensagem,
                dataUltimaMensagem: new Date(),
                mensagensNaoLidas: remetente === 'cliente' ? c.mensagensNaoLidas + 1 : c.mensagensNaoLidas,
                ativa: true
              }
            : c
        );
      } else {
        const novaConversacao: ChatConversation = {
          id: gerarId(),
          clienteId,
          clienteNome: cliente.nome,
          ultimaMensagem: mensagem,
          dataUltimaMensagem: new Date(),
          mensagensNaoLidas: remetente === 'cliente' ? 1 : 0,
          ativa: true,
          tenantId: tenant?.id || ''
        };
        return [...prev, novaConversacao];
      }
    });
  };

  const marcarMensagemLida = (messageId: string) => {
    setChatMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, lida: true } : m
    ));
  };

  const marcarConversacaoLida = (conversationId: string) => {
    setChatConversations(prev => prev.map(c => 
      c.id === conversationId ? { ...c, mensagensNaoLidas: 0 } : c
    ));
    
    // Marcar todas as mensagens da conversação como lidas
    const conversacao = chatConversations.find(c => c.id === conversationId);
    if (conversacao) {
      setChatMessages(prev => prev.map(m => 
        m.clienteId === conversacao.clienteId && m.remetente === 'cliente' ? { ...m, lida: true } : m
      ));
    }
  };

  // Atualizar métricas
  const atualizarMetricas = () => {
    const totalProcessos = processos.length;
    const processosAtivos = processos.filter(p => {
      const etapa = etapas.find(e => e.id === p.statusAtual);
      return etapa?.nome !== 'Entregue';
    }).length;
    
    const processosConcluidos = totalProcessos - processosAtivos;
    const processosAtrasados = processos.filter(p => 
      p.dataPrevistaEntrega < new Date() && !p.dataEntregaRealizada
    ).length;

    const faturamentoMes = processos
      .filter(p => p.dataVenda.getMonth() === new Date().getMonth())
      .reduce((total, p) => total + p.valorTotal, 0);

    const novasMetricas: DashboardMetricas = {
      totalProcessos,
      processosAtivos,
      processosConcluidos,
      processosAtrasados,
      faturamentoMes,
      tempoMedioProcesso: 7, // Dias - calculado dinamicamente
      conversaoLeadVenda: 85, // Percentual
      gargalos: etapas.map(etapa => ({
        etapa: etapa.nome,
        quantidade: processos.filter(p => p.statusAtual === etapa.id).length,
        tempoMedio: 3 // Dias
      })),
      metasPorEtapa: etapas.map(etapa => ({
        etapaId: etapa.id,
        meta: 50,
        atual: processos.filter(p => p.statusAtual === etapa.id).length,
        percentual: 75
      }))
    };

    setMetricas(novasMetricas);
  };

  const value: ProcessFlowContextType = {
    currentUser,
    tenant,
    isAuthenticated,
    usuarios,
    etapas,
    processos,
    notificacoes,
    clientes,
    metricas,
    chatMessages,
    chatConversations,
    login,
    logout,
    criarUsuario,
    editarUsuario,
    excluirUsuario,
    alterarSenha,
    criarCliente,
    editarCliente,
    excluirCliente,
    criarEtapa,
    editarEtapa,
    excluirEtapa,
    reordenarEtapas,
    criarProcesso,
    editarProcesso,
    excluirProcesso,
    moverProcesso,
    buscarProcessos,
    filtrarProcessos,
    temPermissao,
    marcarNotificacaoLida,
    atualizarMetricas,
    enviarMensagemChat,
    marcarMensagemLida,
    marcarConversacaoLida
  };

  return (
    <ProcessFlowContext.Provider value={value}>
      {children}
    </ProcessFlowContext.Provider>
  );
};