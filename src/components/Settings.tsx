import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProcessFlow } from '@/context/ProcessFlowContext';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Bell, 
  Database, 
  Shield,
  Save,
  Upload,
  AlertTriangle,
  Mail,
  Smartphone,
  Globe,
  Lock,
  MapPin,
  Edit,
  Plus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { 
    currentUser, 
    temPermissao,
    etapas,
    editarEtapa,
    reordenarEtapas 
  } = useProcessFlow();

  const [configuracoes, setConfiguracoes] = useState({
    // Configurações gerais
    nomeEmpresa: 'ProcessFlow',
    logo: '',
    corPrimaria: '#3b82f6',
    corSecundaria: '#64748b',
    
    // Notificações
    notificacoesEmail: true,
    notificacoesPush: true,
    diasAvisoAtraso: 3,
    diasAvisoVencimento: 7,
    
    // Backup
    backupAutomatico: true,
    frequenciaBackup: 'semanal',
    manterBackupPor: 12,
    
    // Segurança
    sessaoExpira: 240, // minutos
    tentativasLogin: 5,
    senhaMinima: 8,
    
    // Integração
    webhookUrl: '',
    apiKey: '',
    enviarAtualizacoes: false
  });

  const salvarConfiguracoes = () => {
    toast({
      title: "Configurações salvas",
      description: "Todas as configurações foram atualizadas com sucesso",
    });
  };

  const alterarCorEtapa = (etapaId: string, novaCor: string) => {
    editarEtapa(etapaId, { cor: novaCor });
  };

  if (!temPermissao('configuracoes.editar')) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-muted-foreground">
                Você não tem permissão para alterar configurações do sistema.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
          <p className="text-muted-foreground">
            Gerencie configurações gerais, aparência e comportamento do sistema
          </p>
        </div>
        <Button onClick={salvarConfiguracoes}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Configurações Gerais
            </CardTitle>
            <CardDescription>Configurações básicas da empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
              <Input
                id="nomeEmpresa"
                value={configuracoes.nomeEmpresa}
                onChange={(e) => setConfiguracoes({ ...configuracoes, nomeEmpresa: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Logo da Empresa</Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept="image/*" />
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="corPrimaria">Cor Primária</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="corPrimaria"
                    type="color"
                    value={configuracoes.corPrimaria}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, corPrimaria: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={configuracoes.corPrimaria}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, corPrimaria: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="corSecundaria">Cor Secundária</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="corSecundaria"
                    type="color"
                    value={configuracoes.corSecundaria}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, corSecundaria: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={configuracoes.corSecundaria}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, corSecundaria: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Notificação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
            <CardDescription>Configure alertas e avisos do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <Label htmlFor="emailNotif">Notificações por Email</Label>
              </div>
              <Switch
                id="emailNotif"
                checked={configuracoes.notificacoesEmail}
                onCheckedChange={(checked) => setConfiguracoes({ ...configuracoes, notificacoesEmail: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <Label htmlFor="pushNotif">Notificações Push</Label>
              </div>
              <Switch
                id="pushNotif"
                checked={configuracoes.notificacoesPush}
                onCheckedChange={(checked) => setConfiguracoes({ ...configuracoes, notificacoesPush: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diasAtraso">Dias para Aviso de Atraso</Label>
              <Input
                id="diasAtraso"
                type="number"
                value={configuracoes.diasAvisoAtraso}
                onChange={(e) => setConfiguracoes({ ...configuracoes, diasAvisoAtraso: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diasVencimento">Dias para Aviso de Vencimento</Label>
              <Input
                id="diasVencimento"
                type="number"
                value={configuracoes.diasAvisoVencimento}
                onChange={(e) => setConfiguracoes({ ...configuracoes, diasAvisoVencimento: parseInt(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Etapas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Personalização de Etapas
            </CardTitle>
            <CardDescription>Customize as cores das etapas do processo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {etapas.map(etapa => (
              <div key={etapa.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: etapa.cor }}
                  />
                  <span className="text-sm font-medium">{etapa.nome}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={etapa.cor}
                    onChange={(e) => alterarCorEtapa(etapa.id, e.target.value)}
                    className="w-10 h-8"
                  />
                  <Input
                    value={etapa.cor}
                    onChange={(e) => alterarCorEtapa(etapa.id, e.target.value)}
                    className="w-20 text-xs"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Configurações de Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Segurança
            </CardTitle>
            <CardDescription>Configurações de segurança e acesso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sessaoExpira">Sessão expira em (minutos)</Label>
              <Input
                id="sessaoExpira"
                type="number"
                value={configuracoes.sessaoExpira}
                onChange={(e) => setConfiguracoes({ ...configuracoes, sessaoExpira: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tentativasLogin">Máximo de tentativas de login</Label>
              <Input
                id="tentativasLogin"
                type="number"
                value={configuracoes.tentativasLogin}
                onChange={(e) => setConfiguracoes({ ...configuracoes, tentativasLogin: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senhaMinima">Comprimento mínimo da senha</Label>
              <Input
                id="senhaMinima"
                type="number"
                value={configuracoes.senhaMinima}
                onChange={(e) => setConfiguracoes({ ...configuracoes, senhaMinima: parseInt(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Backup e Armazenamento
            </CardTitle>
            <CardDescription>Configurações de backup automático</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="backupAuto">Backup Automático</Label>
              <Switch
                id="backupAuto"
                checked={configuracoes.backupAutomatico}
                onCheckedChange={(checked) => setConfiguracoes({ ...configuracoes, backupAutomatico: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequenciaBackup">Frequência do Backup</Label>
              <Select 
                value={configuracoes.frequenciaBackup} 
                onValueChange={(value) => setConfiguracoes({ ...configuracoes, frequenciaBackup: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diário</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manterBackup">Manter backups por (meses)</Label>
              <Input
                id="manterBackup"
                type="number"
                value={configuracoes.manterBackupPor}
                onChange={(e) => setConfiguracoes({ ...configuracoes, manterBackupPor: parseInt(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Localizações Físicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Localizações Físicas
            </CardTitle>
            <CardDescription>Gerencie as localizações físicas dos processos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Pátio</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">Ativa</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Salão</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">Ativa</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">Rua</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">Ativa</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="font-medium">Expedição</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">Ativa</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="font-medium">Entregue</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">Ativa</span>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Localização
            </Button>
          </CardContent>
        </Card>

        {/* Integrações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Integrações
            </CardTitle>
            <CardDescription>Configure integrações com sistemas externos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">URL do Webhook</Label>
              <Input
                id="webhookUrl"
                value={configuracoes.webhookUrl}
                onChange={(e) => setConfiguracoes({ ...configuracoes, webhookUrl: e.target.value })}
                placeholder="https://exemplo.com/webhook"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">Chave da API</Label>
              <Input
                id="apiKey"
                type="password"
                value={configuracoes.apiKey}
                onChange={(e) => setConfiguracoes({ ...configuracoes, apiKey: e.target.value })}
                placeholder="Chave secreta da API"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enviarAtualizacoes">Enviar atualizações automáticas</Label>
              <Switch
                id="enviarAtualizacoes"
                checked={configuracoes.enviarAtualizacoes}
                onCheckedChange={(checked) => setConfiguracoes({ ...configuracoes, enviarAtualizacoes: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;