import { 
  User, 
  Tenant, 
  Etapa, 
  Processo, 
  Notificacao, 
  HistoricoMovimento,
  Cliente 
} from '@/types/processflow';

// Dados mock para demonstração do sistema ProcessFlow

export const mockData = {
  // Tenant de demonstração
  tenant: {
    id: 'tenant-demo',
    nome: 'ProcessFlow Demo',
    dominio: 'demo.processflow.com',
    logo: undefined,
    corPrimaria: '#3B82F6',
    corSecundaria: '#64748B',
    ativo: true,
    dataCriacao: new Date('2024-01-01'),
    configuracoes: {
      permiteCustomizacao: true,
      maxUsuarios: 100,
      maxProcessos: 1000
    }
  } as Tenant,

  // Usuários padrão do sistema
  usuarios: [
    {
      id: 'user-admin',
      nome: 'Administrador',
      email: 'admin',
      senha: 'admin',
      role: 'admin' as const,
      setor: 'TI',
      equipe: 'Gestão',
      ativo: true,
      dataCriacao: new Date('2024-01-01'),
      ultimoLogin: new Date(),
      tenantId: 'tenant-demo'
    },
    {
      id: 'user-supervisor',
      nome: 'João Supervisor',
      email: 'supervisor',
      senha: 'supervisor',
      role: 'supervisor' as const,
      setor: 'Vendas',
      equipe: 'Comercial',
      ativo: true,
      dataCriacao: new Date('2024-01-01'),
      tenantId: 'tenant-demo'
    },
    {
      id: 'user-operador',
      nome: 'Maria Operadora',
      email: 'operador',
      senha: 'operador',
      role: 'operador' as const,
      setor: 'Produção',
      equipe: 'Manufatura',
      ativo: true,
      dataCriacao: new Date('2024-01-01'),
      tenantId: 'tenant-demo'
    },
    {
      id: 'user-leitor',
      nome: 'Cliente Exemplo',
      email: 'cliente',
      senha: 'cliente',
      role: 'leitor' as const,
      setor: 'Cliente',
      equipe: 'Externo',
      ativo: true,
      dataCriacao: new Date('2024-01-01'),
      tenantId: 'tenant-demo',
      clientesVinculados: ['cliente-001', 'cliente-002']
    }
  ] as User[],

  // Etapas padrão do pipeline
  etapas: [
    {
      id: 'etapa-lead',
      nome: 'Lead',
      descricao: 'Prospects e oportunidades iniciais',
      cor: '#F59E0B',
      ordem: 1,
      ativa: true,
      configuracoes: {
        permiteEdicao: true,
        notificarApos: 3,
        obrigatoria: true
      },
      tenantId: 'tenant-demo'
    },
    {
      id: 'etapa-venda',
      nome: 'Venda',
      descricao: 'Negociação e fechamento',
      cor: '#3B82F6',
      ordem: 2,
      ativa: true,
      configuracoes: {
        permiteEdicao: true,
        notificarApos: 5,
        obrigatoria: true
      },
      tenantId: 'tenant-demo'
    },
    {
      id: 'etapa-pagamento',
      nome: 'Pagamento',
      descricao: 'Cobrança e recebimento',
      cor: '#10B981',
      ordem: 3,
      ativa: true,
      configuracoes: {
        permiteEdicao: true,
        notificarApos: 7,
        obrigatoria: true
      },
      tenantId: 'tenant-demo'
    },
    {
      id: 'etapa-producao',
      nome: 'Produção',
      descricao: 'Fabricação do produto',
      cor: '#8B5CF6',
      ordem: 4,
      ativa: true,
      configuracoes: {
        permiteEdicao: true,
        notificarApos: 10,
        obrigatoria: true
      },
      tenantId: 'tenant-demo'
    },
    {
      id: 'etapa-expedicao',
      nome: 'Expedição',
      descricao: 'Preparação para envio',
      cor: '#F97316',
      ordem: 5,
      ativa: true,
      configuracoes: {
        permiteEdicao: true,
        notificarApos: 2,
        obrigatoria: true
      },
      tenantId: 'tenant-demo'
    },
    {
      id: 'etapa-entrega',
      nome: 'Entrega',
      descricao: 'Entrega ao cliente final',
      cor: '#059669',
      ordem: 6,
      ativa: true,
      configuracoes: {
        permiteEdicao: false,
        notificarApos: 0,
        obrigatoria: true
      },
      tenantId: 'tenant-demo'
    }
  ] as Etapa[],

  // Clientes de demonstração
  clientes: [
    {
      id: 'cliente-001',
      nome: 'Empresa ABC Ltda',
      email: 'contato@empresaabc.com',
      telefone: '(11) 9999-9999',
      endereco: 'Rua das Empresas, 123 - São Paulo/SP',
      documento: '12.345.678/0001-90',
      observacoes: 'Cliente preferencial',
      ativo: true,
      dataCriacao: new Date('2024-01-01'),
      tenantId: 'tenant-demo'
    },
    {
      id: 'cliente-002',
      nome: 'Comercial XYZ',
      email: 'vendas@comercialxyz.com',
      telefone: '(11) 8888-8888',
      endereco: 'Av. Comercial, 456 - São Paulo/SP',
      documento: '98.765.432/0001-10',
      observacoes: '',
      ativo: true,
      dataCriacao: new Date('2024-01-05'),
      tenantId: 'tenant-demo'
    },
    {
      id: 'cliente-003',
      nome: 'Indústria DEF S.A.',
      email: 'compras@industriadef.com',
      telefone: '(11) 7777-7777',
      endereco: 'Distrito Industrial, 789 - São Paulo/SP',
      documento: '11.222.333/0001-44',
      observacoes: 'Pagamento sempre à vista',
      ativo: true,
      dataCriacao: new Date('2024-01-10'),
      tenantId: 'tenant-demo'
    },
    {
      id: 'cliente-004',
      nome: 'Startup GHI',
      email: 'tech@startupghi.com',
      telefone: '(11) 6666-6666',
      endereco: 'Hub de Inovação, 101 - São Paulo/SP',
      documento: '55.666.777/0001-88',
      observacoes: 'Startup de tecnologia',
      ativo: true,
      dataCriacao: new Date('2024-01-15'),
      tenantId: 'tenant-demo'
    },
    {
      id: 'cliente-005',
      nome: 'Consultoria JKL',
      email: 'projetos@consultoriajkl.com',
      telefone: '(11) 5555-5555',
      endereco: 'Centro Empresarial, 202 - São Paulo/SP',
      documento: '99.888.777/0001-66',
      observacoes: 'Parceiro estratégico',
      ativo: true,
      dataCriacao: new Date('2024-01-20'),
      tenantId: 'tenant-demo'
    }
  ] as Cliente[],

  // Processos de demonstração
  processos: [
    {
      id: 'processo-001',
      numeroPedido: 'PED-2024-001',
      clienteId: 'cliente-001',
      cliente: 'Empresa ABC Ltda',
      vendedorResponsavel: 'Carlos Vendedor',
      dataVenda: new Date('2024-01-15'),
      dataPrimeiroPagamento: new Date('2024-01-20'),
      dataPrevistaEntrega: new Date('2024-02-15'),
      dataEntregaRealizada: undefined,
      produto: 'Sistema de Gestão Personalizado',
      quantidade: 1,
      embalagem: 'Digital',
      tipoFrete: 'Email',
      statusAtual: 'etapa-producao',
      localizacaoFisica: 'salao' as const,
      cortesias: [],
      faltas: [],
      observacoes: 'Cliente preferencial, priorizar entrega',
      prioridade: 'alta' as const,
      valorTotal: 15000,
      responsavelAtual: 'user-operador',
      historico: [
        {
          id: 'hist-001-1',
          processoId: 'processo-001',
          etapaAnterior: undefined,
          etapaNova: 'etapa-lead',
          usuarioId: 'user-supervisor',
          usuarioNome: 'João Supervisor',
          data: new Date('2024-01-10'),
          comentario: 'Lead recebido via website',
          automatico: false
        },
        {
          id: 'hist-001-2',
          processoId: 'processo-001',
          etapaAnterior: 'etapa-lead',
          etapaNova: 'etapa-venda',
          usuarioId: 'user-supervisor',
          usuarioNome: 'João Supervisor',
          data: new Date('2024-01-15'),
          comentario: 'Venda fechada após demonstração',
          automatico: false
        },
        {
          id: 'hist-001-3',
          processoId: 'processo-001',
          etapaAnterior: 'etapa-venda',
          etapaNova: 'etapa-pagamento',
          usuarioId: 'user-supervisor',
          usuarioNome: 'João Supervisor',
          data: new Date('2024-01-20'),
          comentario: 'Primeira parcela recebida',
          automatico: false
        },
        {
          id: 'hist-001-4',
          processoId: 'processo-001',
          etapaAnterior: 'etapa-pagamento',
          etapaNova: 'etapa-producao',
          usuarioId: 'user-operador',
          usuarioNome: 'Maria Operadora',
          data: new Date('2024-01-25'),
          comentario: 'Produção iniciada',
          automatico: false
        }
      ] as HistoricoMovimento[],
      anexos: [],
      tags: ['vip', 'customizado'],
      dataCriacao: new Date('2024-01-10'),
      dataAtualizacao: new Date('2024-01-25'),
      tenantId: 'tenant-demo'
    },
    {
      id: 'processo-002',
      numeroPedido: 'PED-2024-002',
      clienteId: 'cliente-002',
      cliente: 'Comercial XYZ',
      vendedorResponsavel: 'Ana Silva',
      dataVenda: new Date('2024-01-20'),
      dataPrimeiroPagamento: undefined,
      dataPrevistaEntrega: new Date('2024-02-20'),
      dataEntregaRealizada: undefined,
      produto: 'Website Institucional',
      quantidade: 1,
      embalagem: 'Digital',
      tipoFrete: 'Online',
      statusAtual: 'etapa-venda',
      localizacaoFisica: 'patio' as const,
      cortesias: ['Design extra'],
      faltas: [],
      observacoes: 'Aguardando aprovação final do layout',
      prioridade: 'normal' as const,
      valorTotal: 8500,
      responsavelAtual: 'user-supervisor',
      historico: [
        {
          id: 'hist-002-1',
          processoId: 'processo-002',
          etapaAnterior: undefined,
          etapaNova: 'etapa-lead',
          usuarioId: 'user-supervisor',
          usuarioNome: 'João Supervisor',
          data: new Date('2024-01-18'),
          comentario: 'Contato via telefone',
          automatico: false
        },
        {
          id: 'hist-002-2',
          processoId: 'processo-002',
          etapaAnterior: 'etapa-lead',
          etapaNova: 'etapa-venda',
          usuarioId: 'user-supervisor',
          usuarioNome: 'João Supervisor',
          data: new Date('2024-01-20'),
          comentario: 'Proposta aceita',
          automatico: false
        }
      ] as HistoricoMovimento[],
      anexos: [],
      tags: ['website', 'design'],
      dataCriacao: new Date('2024-01-18'),
      dataAtualizacao: new Date('2024-01-20'),
      tenantId: 'tenant-demo'
    },
    {
      id: 'processo-003',
      numeroPedido: 'PED-2024-003',
      clienteId: 'cliente-003',
      cliente: 'Indústria DEF S.A.',
      vendedorResponsavel: 'Pedro Santos',
      dataVenda: new Date('2024-01-25'),
      dataPrimeiroPagamento: new Date('2024-01-30'),
      dataPrevistaEntrega: new Date('2024-03-01'),
      dataEntregaRealizada: undefined,
      produto: 'Automação Industrial',
      quantidade: 3,
      embalagem: 'Caixa reforçada',
      tipoFrete: 'Transportadora',
      statusAtual: 'etapa-pagamento',
      localizacaoFisica: 'rua' as const,
      cortesias: [],
      faltas: ['Manual técnico'],
      observacoes: 'Instalação agendada para março',
      prioridade: 'urgente' as const,
      valorTotal: 45000,
      responsavelAtual: 'user-supervisor',
      historico: [
        {
          id: 'hist-003-1',
          processoId: 'processo-003',
          etapaAnterior: undefined,
          etapaNova: 'etapa-lead',
          usuarioId: 'user-supervisor',
          usuarioNome: 'João Supervisor',
          data: new Date('2024-01-22'),
          comentario: 'Licitação pública',
          automatico: false
        },
        {
          id: 'hist-003-2',
          processoId: 'processo-003',
          etapaAnterior: 'etapa-lead',
          etapaNova: 'etapa-venda',
          usuarioId: 'user-supervisor',
          usuarioNome: 'João Supervisor',
          data: new Date('2024-01-25'),
          comentario: 'Contrato assinado',
          automatico: false
        },
        {
          id: 'hist-003-3',
          processoId: 'processo-003',
          etapaAnterior: 'etapa-venda',
          etapaNova: 'etapa-pagamento',
          usuarioId: 'user-supervisor',
          usuarioNome: 'João Supervisor',
          data: new Date('2024-01-30'),
          comentario: 'Entrada recebida',
          automatico: false
        }
      ] as HistoricoMovimento[],
      anexos: [],
      tags: ['industrial', 'licitacao'],
      dataCriacao: new Date('2024-01-22'),
      dataAtualizacao: new Date('2024-01-30'),
      tenantId: 'tenant-demo'
    },
    {
      id: 'processo-004',
      numeroPedido: 'PED-2024-004',
      clienteId: 'cliente-004',
      cliente: 'Startup GHI',
      vendedorResponsavel: 'Lucas Oliveira',
      dataVenda: new Date('2024-02-01'),
      dataPrimeiroPagamento: undefined,
      dataPrevistaEntrega: new Date('2024-02-28'),
      dataEntregaRealizada: undefined,
      produto: 'App Mobile',
      quantidade: 1,
      embalagem: 'Digital',
      tipoFrete: 'App Store',
      statusAtual: 'etapa-lead',
      localizacaoFisica: 'patio' as const,
      cortesias: ['Suporte 3 meses'],
      faltas: [],
      observacoes: 'Primeira versão MVP',
      prioridade: 'normal' as const,
      valorTotal: 25000,
      responsavelAtual: 'user-supervisor',
      historico: [
        {
          id: 'hist-004-1',
          processoId: 'processo-004',
          etapaAnterior: undefined,
          etapaNova: 'etapa-lead',
          usuarioId: 'user-supervisor',
          usuarioNome: 'João Supervisor',
          data: new Date('2024-02-01'),
          comentario: 'Reunião inicial realizada',
          automatico: false
        }
      ] as HistoricoMovimento[],
      anexos: [],
      tags: ['mobile', 'mvp', 'startup'],
      dataCriacao: new Date('2024-02-01'),
      dataAtualizacao: new Date('2024-02-01'),
      tenantId: 'tenant-demo'
    },
    {
      id: 'processo-005',
      numeroPedido: 'PED-2024-005',
      clienteId: 'cliente-005',
      cliente: 'Consultoria JKL',
      vendedorResponsavel: 'Fernanda Costa',
      dataVenda: new Date('2024-01-28'),
      dataPrimeiroPagamento: new Date('2024-02-05'),
      dataPrevistaEntrega: new Date('2024-02-10'),
      dataEntregaRealizada: new Date('2024-02-10'),
      produto: 'Treinamento Corporativo',
      quantidade: 1,
      embalagem: 'Presencial',
      tipoFrete: 'In-loco',
      statusAtual: 'etapa-entrega',
      localizacaoFisica: 'entregue' as const,
      cortesias: [],
      faltas: [],
      observacoes: 'Treinamento concluído com sucesso',
      prioridade: 'normal' as const,
      valorTotal: 12000,
      responsavelAtual: 'user-supervisor',
      historico: [
        {
          id: 'hist-005-1',
          processoId: 'processo-005',
          etapaAnterior: undefined,
          etapaNova: 'etapa-lead',
          usuarioId: 'user-supervisor',
          usuarioNome: 'João Supervisor',
          data: new Date('2024-01-25'),
          comentario: 'Indicação de cliente',
          automatico: false
        },
        {
          id: 'hist-005-2',
          processoId: 'processo-005',
          etapaAnterior: 'etapa-lead',
          etapaNova: 'etapa-venda',
          usuarioId: 'user-supervisor',
          usuarioNome: 'João Supervisor',
          data: new Date('2024-01-28'),
          comentario: 'Fechamento rápido',
          automatico: false
        },
        {
          id: 'hist-005-3',
          processoId: 'processo-005',
          etapaAnterior: 'etapa-venda',
          etapaNova: 'etapa-pagamento',
          usuarioId: 'user-supervisor',
          usuarioNome: 'João Supervisor',
          data: new Date('2024-02-05'),
          comentario: 'Pagamento à vista',
          automatico: false
        },
        {
          id: 'hist-005-4',
          processoId: 'processo-005',
          etapaAnterior: 'etapa-pagamento',
          etapaNova: 'etapa-producao',
          usuarioId: 'user-operador',
          usuarioNome: 'Maria Operadora',
          data: new Date('2024-02-06'),
          comentario: 'Material preparado',
          automatico: false
        },
        {
          id: 'hist-005-5',
          processoId: 'processo-005',
          etapaAnterior: 'etapa-producao',
          etapaNova: 'etapa-expedicao',
          usuarioId: 'user-operador',
          usuarioNome: 'Maria Operadora',
          data: new Date('2024-02-09'),
          comentario: 'Pronto para entrega',
          automatico: false
        },
        {
          id: 'hist-005-6',
          processoId: 'processo-005',
          etapaAnterior: 'etapa-expedicao',
          etapaNova: 'etapa-entrega',
          usuarioId: 'user-supervisor',
          usuarioNome: 'João Supervisor',
          data: new Date('2024-02-10'),
          comentario: 'Treinamento realizado com sucesso',
          automatico: false
        }
      ] as HistoricoMovimento[],
      anexos: [],
      tags: ['treinamento', 'concluido'],
      dataCriacao: new Date('2024-01-25'),
      dataAtualizacao: new Date('2024-02-10'),
      tenantId: 'tenant-demo'
    }
  ] as Processo[],

  // Notificações do sistema
  notificacoes: [
    {
      id: 'notif-001',
      tipo: 'atraso' as const,
      titulo: 'Processo Atrasado',
      mensagem: 'O pedido PED-2024-001 está com a entrega atrasada há 2 dias',
      processoId: 'processo-001',
      usuarioId: 'user-supervisor',
      lida: false,
      data: new Date(),
      tenantId: 'tenant-demo'
    },
    {
      id: 'notif-002',
      tipo: 'parado' as const,
      titulo: 'Processo Parado',
      mensagem: 'O pedido PED-2024-002 está parado na etapa de Venda há 5 dias',
      processoId: 'processo-002',
      usuarioId: 'user-supervisor',
      lida: false,
      data: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      tenantId: 'tenant-demo'
    },
    {
      id: 'notif-003',
      tipo: 'vencimento' as const,
      titulo: 'Pagamento Vencendo',
      mensagem: 'O pagamento do pedido PED-2024-003 vence em 2 dias',
      processoId: 'processo-003',
      usuarioId: 'user-admin',
      lida: true,
      data: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
      tenantId: 'tenant-demo'
    }
  ] as Notificacao[],

  chatMessages: [],
  chatConversations: []
};