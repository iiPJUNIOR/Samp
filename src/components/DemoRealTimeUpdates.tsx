import React, { useEffect, useState } from 'react';
import { useProcessFlow } from '@/context/ProcessFlowContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw } from 'lucide-react';

/**
 * Componente para demonstrar atualizações em tempo real na dashboard
 * Simula movimentação de processos entre etapas automaticamente
 */
const DemoRealTimeUpdates: React.FC = () => {
  const { processos, etapas, moverProcesso } = useProcessFlow();
  const [isRunning, setIsRunning] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const [nextUpdate, setNextUpdate] = useState(3);

  // Função para mover um processo aleatório para uma etapa aleatória
  const moveRandomProcess = () => {
    if (processos.length === 0 || etapas.length === 0) return;
    
    // Selecionar um processo aleatório
    const randomProcessIndex = Math.floor(Math.random() * processos.length);
    const randomProcess = processos[randomProcessIndex];
    
    // Selecionar uma etapa aleatória diferente da atual
    const currentEtapaIndex = etapas.findIndex(e => e.id === randomProcess.statusAtual);
    let newEtapaIndex;
    
    do {
      newEtapaIndex = Math.floor(Math.random() * etapas.length);
    } while (newEtapaIndex === currentEtapaIndex);
    
    const newEtapa = etapas[newEtapaIndex];
    
    // Mover o processo para a nova etapa
    moverProcesso(
      randomProcess.id, 
      newEtapa.id, 
      `Movido automaticamente para demonstração de atualização em tempo real`
    );
    
    setUpdateCount(prev => prev + 1);
  };

  // Efeito para executar a simulação de movimentação
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning) {
      // Contador regressivo para a próxima atualização
      const countdownTimer = setInterval(() => {
        setNextUpdate(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Timer para mover processos a cada 3 segundos
      timer = setInterval(() => {
        moveRandomProcess();
        setNextUpdate(3);
      }, 3000);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [isRunning, processos, etapas]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-card border rounded-lg shadow-md p-3 flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Demonstração em tempo real</span>
          <div className="flex items-center gap-1">
            <RefreshCw className={`w-3 h-3 ${isRunning ? 'animate-spin text-primary' : 'text-muted-foreground'}`} />
            <span className="text-xs font-medium">
              {isRunning 
                ? `Próxima em ${nextUpdate}s` 
                : `${updateCount} atualizações`}
            </span>
          </div>
        </div>
        
        <Button
          size="sm"
          variant={isRunning ? "destructive" : "default"}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-1" />
              Parar
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-1" />
              Iniciar
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DemoRealTimeUpdates;