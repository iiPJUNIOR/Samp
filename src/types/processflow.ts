// Types para o sistema ProcessFlow

export type UserRole = 'admin' | 'supervisor' | 'operador' | 'leitor';

export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string;
  role: UserRole;
  setor?: string;
  equipe?: string;
  ativo: boolean;
  dataCriacao: Date;
  ultimoLogin?: Date;
  tenantId: string;
  clientesVinculados?: string[]; // IDs dos clientes que o usuário leitor pode visualizar
  permissoes?: PermissaoUsuario[]; // Permissões específicas do usuário
}

export interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  documento?: string; // CPF/CNPJ
  observacoes?: string;
  ativo: boolean;
  dataCriacao: Date;
  tenantId: string;
}

export interface Tenant {
  id: string;
  nome: string;
  dominio: string;
  logo?: string;
  corPrimaria: string;
  corSecundaria: string;
  ativo: boolean;
  dataCriacao: Date;
  configuracoes: {
    permiteCustomizacao: boolean;
    maxUsuarios: number;
    maxProcessos: number;
  };
}

export interface Etapa {
  id: string;
  nome: string;
  descricao?: string;
  cor: string;
  ordem: number;
  ativa: boolean;
  configuracoes: {
    permiteEdicao: boolean;
    notificarApos: number; // dias
    obrigatoria: boolean;
  };
  tenantId: string;
}

export interface Processo {
  id: string;
  numeroPedido: string;
  clienteId: string; // ID do cliente vinculado
  cliente: string; // Nome do cliente (mantido para compatibilidade)
  vendedorResponsavel: string;
  dataVenda: Date;
  dataPrimeiroPagamento?: Date;
  dataPrevistaEntrega: Date;
  dataEntregaRealizada?: Date;
  produto: string;
  quantidade: number;
  embalagem: string;
  tipoFrete: string;
  statusAtual: string; // ID da etapa atual
  localizacaoFisica: LocalizacaoFisica;
  cortesias: string[];
  faltas: string[];
  observacoes: string;
  prioridade: 'baixa' | 'normal' | 'alta' | 'urgente';
  valorTotal: number;
  responsavelAtual?: string; // ID do usuário
  historico: HistoricoMovimento[];
  anexos: Anexo[];
  tags: string[];
  dataCriacao: Date;
  dataAtualizacao: Date;
  tenantId: string;
}

export type LocalizacaoFisica = 'patio' | 'salao' | 'rua' | 'expedicao' | 'entregue';

export interface LocalizacaoFisicaItem {
  id: string;
  nome: string;
  descricao?: string;
  cor: string;
  ativa: boolean;
  capacidade?: number;
  responsavel?: string;
  observacoes?: string;
  ordem: number;
  tenantId: string;
}

export interface PermissaoUsuario {
  modulo: string;
  visualizar: boolean;
  criar: boolean;
  editar: boolean;
  excluir: boolean;
}

export interface HistoricoMovimento {
  id: string;
  processoId: string;
  etapaAnterior?: string;
  etapaNova: string;
  usuarioId: string;
  usuarioNome: string;
  data: Date;
  comentario?: string;
  localizacaoAnterior?: LocalizacaoFisica;
  localizacaoNova?: LocalizacaoFisica;
  automatico: boolean;
}

export interface Anexo {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  dataUpload: Date;
  usuarioId: string;
}

export interface Notificacao {
  id: string;
  tipo: 'atraso' | 'parado' | 'vencimento' | 'sistema';
  titulo: string;
  mensagem: string;
  processoId?: string;
  usuarioId: string;
  lida: boolean;
  data: Date;
  tenantId: string;
}

export interface Filtro {
  termo?: string;
  etapas?: string[];
  vendedores?: string[];
  clientes?: string[];
  dataInicio?: Date;
  dataFim?: Date;
  localizacao?: LocalizacaoFisica[];
  prioridade?: string[];
  responsavel?: string;
  tags?: string[];
}

export interface Relatorio {
  tipo: 'processos' | 'vendas' | 'producao' | 'gargalos' | 'conversao';
  titulo: string;
  dados: any;
  geradoPor: string;
  dataGeracao: Date;
  parametros: Filtro;
  formato: 'pdf' | 'excel';
}

export interface DashboardMetricas {
  totalProcessos: number;
  processosAtivos: number;
  processosConcluidos: number;
  processosAtrasados: number;
  faturamentoMes: number;
  tempoMedioProcesso: number;
  conversaoLeadVenda: number;
  gargalos: {
    etapa: string;
    quantidade: number;
    tempoMedio: number;
  }[];
  metasPorEtapa: {
    etapaId: string;
    meta: number;
    atual: number;
    percentual: number;
  }[];
}

// Configurações do sistema
export interface ConfiguracaoSistema {
  tenantId: string;
  notificacoes: {
    emailAtivo: boolean;
    pushAtivo: boolean;
    diasAvisoAtraso: number;
    diasAvisoVencimento: number;
  };
  backup: {
    automatico: boolean;
    frequencia: 'diario' | 'semanal' | 'mensal';
    manterPor: number; // meses
  };
  integracao: {
    webhookUrl?: string;
    apiKey?: string;
    enviarAtualizacoes: boolean;
  };
}

// Permissões por role
export interface ChatMessage {
  id: string;
  clienteId: string;
  clienteNome: string;
  remetente: 'cliente' | 'admin';
  mensagem: string;
  data: Date;
  lida: boolean;
  tenantId: string;
}

export interface ChatConversation {
  id: string;
  clienteId: string;
  clienteNome: string;
  ultimaMensagem: string;
  dataUltimaMensagem: Date;
  mensagensNaoLidas: number;
  ativa: boolean;
  tenantId: string;
}

export const PERMISSOES: Record<UserRole, string[]> = {
  admin: [
    'usuarios.criar',
    'usuarios.editar',
    'usuarios.excluir',
    'usuarios.visualizar',
    'etapas.criar',
    'etapas.editar',
    'etapas.excluir',
    'etapas.reordenar',
    'processos.criar',
    'processos.editar',
    'processos.excluir',
    'processos.visualizar',
    'processos.mover',
    'processos.finalizar',
    'clientes.criar',
    'clientes.editar',
    'clientes.excluir',
    'clientes.visualizar',
    'relatorios.todos',
    'configuracoes.editar',
    'branding.editar',
    'logs.visualizar'
  ],
  supervisor: [
    'processos.criar',
    'processos.editar',
    'processos.visualizar',
    'processos.mover',
    'processos.finalizar',
    'clientes.criar',
    'clientes.editar',
    'clientes.visualizar',
    'relatorios.setor',
    'usuarios.visualizar'
  ],
  operador: [
    'processos.visualizar',
    'processos.mover',
    'processos.finalizar',
    'clientes.visualizar'
  ],
  leitor: [
    'processos.visualizar',
    'clientes.visualizar',
    'relatorios.setor'
  ]
};