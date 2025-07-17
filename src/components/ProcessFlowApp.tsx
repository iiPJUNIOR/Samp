import React, { useState } from 'react';
import { ProcessFlowProvider, useProcessFlow } from '@/context/ProcessFlowContext';
import Login from './Login';
import Layout from './Layout';
import Dashboard from './Dashboard';
import ProcessManagement from './ProcessManagement';
import UserManagement from './UserManagement';
import ClientManagement from './ClientManagement';
import CustomerPortal from './CustomerPortal';
import Reports from './Reports';
import Settings from './Settings';
import AdminChat from './AdminChat';

const RelatoriosPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Relatórios e Analytics</h1>
    <p className="text-muted-foreground">
      Módulo de relatórios em desenvolvimento. 
      Incluirá gráficos, métricas detalhadas e exportação em PDF/Excel.
    </p>
  </div>
);

const ConfiguracoesPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Configurações do Sistema</h1>
    <p className="text-muted-foreground">
      Módulo de configurações em desenvolvimento. 
      Incluirá gestão de etapas, branding, notificações e integrações.
    </p>
  </div>
);

const AppContent: React.FC = () => {
  const { isAuthenticated, currentUser } = useProcessFlow();
  // Inicializa com 'dashboard' como padrão
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Efeito para atualizar a página atual quando o usuário fizer login
  React.useEffect(() => {
    if (isAuthenticated && currentUser?.role === 'operador') {
      setCurrentPage('processos');
    }
  }, [isAuthenticated, currentUser]);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'processos':
        return <ProcessManagement />;
      case 'usuarios':
        return <UserManagement />;
      case 'clientes':
        return <ClientManagement />;
      case 'relatorios':
        return <RelatoriosPage />;
      case 'configuracoes':
        return <ConfiguracoesPage />;
      case 'chat':
        return <AdminChat />;
      default:
        return <Dashboard />;
    }
  };

  // Se o usuário é leitor, mostrar apenas o portal do cliente
  if (currentUser?.role === 'leitor') {
    return (
      <Layout currentPage="customer-portal" onPageChange={setCurrentPage}>
        <CustomerPortal />
      </Layout>
    );
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

const ProcessFlowApp: React.FC = () => {
  return (
    <ProcessFlowProvider>
      <AppContent />
    </ProcessFlowProvider>
  );
};

export default ProcessFlowApp;