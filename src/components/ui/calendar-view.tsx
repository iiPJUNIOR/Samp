import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Processo } from '@/types/processflow';

interface CalendarViewProps {
  processos: Processo[];
  onProcessClick: (processo: Processo) => void;
  getEtapaCor: (etapaId: string) => string;
  getEtapaNome: (etapaId: string) => string;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  processos,
  onProcessClick,
  getEtapaCor,
  getEtapaNome
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week'>('month');

  // Funções para navegação no calendário
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Obter o primeiro dia do mês atual
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  // Obter o último dia do mês atual
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Obter o dia da semana do primeiro dia do mês (0 = Domingo, 1 = Segunda, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // Calcular o número de dias no mês atual
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Nomes dos meses em português
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  // Nomes dos dias da semana em português
  const weekdayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Função para verificar se um processo está agendado para uma data específica
  const getProcessosForDate = (date: Date) => {
    return processos.filter(processo => {
      const dataVenda = new Date(processo.dataVenda);
      const dataPrevistaEntrega = new Date(processo.dataPrevistaEntrega);
      
      // Verificar se a data de venda ou a data prevista de entrega corresponde à data do calendário
      return (
        dataVenda.getDate() === date.getDate() &&
        dataVenda.getMonth() === date.getMonth() &&
        dataVenda.getFullYear() === date.getFullYear()
      ) || (
        dataPrevistaEntrega.getDate() === date.getDate() &&
        dataPrevistaEntrega.getMonth() === date.getMonth() &&
        dataPrevistaEntrega.getFullYear() === date.getFullYear()
      );
    });
  };

  // Renderizar o calendário mensal
  const renderMonthCalendar = () => {
    const calendar = [];
    let dayCounter = 1;
    
    // Renderizar cabeçalho com os dias da semana
    const weekdayHeader = (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdayNames.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium py-2">
            {day}
          </div>
        ))}
      </div>
    );
    
    // Calcular o número de semanas necessárias
    const totalDays = firstDayOfWeek + daysInMonth;
    const totalWeeks = Math.ceil(totalDays / 7);
    
    // Renderizar as semanas
    for (let week = 0; week < totalWeeks; week++) {
      const weekRow = [];
      
      // Renderizar os dias da semana
      for (let day = 0; day < 7; day++) {
        const dayIndex = week * 7 + day;
        const dayNumber = dayIndex - firstDayOfWeek + 1;
        
        if (dayNumber > 0 && dayNumber <= daysInMonth) {
          // Data atual do calendário
          const currentCalendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
          
          // Verificar se é hoje
          const isToday = 
            currentCalendarDate.getDate() === new Date().getDate() &&
            currentCalendarDate.getMonth() === new Date().getMonth() &&
            currentCalendarDate.getFullYear() === new Date().getFullYear();
          
          // Obter processos para esta data
          const processosDodia = getProcessosForDate(currentCalendarDate);
          
          weekRow.push(
            <div 
              key={day} 
              className={`min-h-[120px] border p-1 ${
                isToday ? 'bg-primary/10 border-primary' : 'hover:bg-muted/30'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
                  {dayNumber}
                </span>
                {processosDodia.length > 0 && (
                  <Badge variant="secondary">{processosDodia.length}</Badge>
                )}
              </div>
              
              <div className="space-y-1 overflow-y-auto max-h-[80px] calendar-scrollbar">
                {processosDodia.map(processo => {
                  const isVenda = 
                    processo.dataVenda.getDate() === currentCalendarDate.getDate() &&
                    processo.dataVenda.getMonth() === currentCalendarDate.getMonth() &&
                    processo.dataVenda.getFullYear() === currentCalendarDate.getFullYear();
                  
                  const isEntrega = 
                    processo.dataPrevistaEntrega.getDate() === currentCalendarDate.getDate() &&
                    processo.dataPrevistaEntrega.getMonth() === currentCalendarDate.getMonth() &&
                    processo.dataPrevistaEntrega.getFullYear() === currentCalendarDate.getFullYear();
                  
                  return (
                    <div 
                      key={processo.id} 
                      className="text-xs p-1 rounded cursor-pointer hover:bg-muted"
                      onClick={() => onProcessClick(processo)}
                    >
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: getEtapaCor(processo.statusAtual) }}
                        />
                        <span className="truncate">{processo.numeroPedido}</span>
                      </div>
                      <div className="pl-3 text-muted-foreground truncate">
                        {isVenda && 'Venda'}
                        {isEntrega && 'Entrega'}
                        {': '}
                        {processo.cliente}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        } else {
          // Dias vazios antes do início do mês ou após o fim do mês
          weekRow.push(
            <div key={day} className="min-h-[120px] border bg-muted/20 p-1"></div>
          );
        }
      }
      
      calendar.push(
        <div key={week} className="grid grid-cols-7 gap-1">
          {weekRow}
        </div>
      );
    }
    
    return (
      <div className="space-y-1">
        {weekdayHeader}
        {calendar}
      </div>
    );
  };

  // Renderizar o calendário semanal
  const renderWeekCalendar = () => {
    // Obter o primeiro dia da semana atual (domingo)
    const firstDayOfWeek = new Date(currentDate);
    const day = currentDate.getDay();
    firstDayOfWeek.setDate(currentDate.getDate() - day);
    
    const weekDays = [];
    
    // Renderizar cabeçalho com os dias da semana
    const weekdayHeader = (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdayNames.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium py-2">
            {day}
          </div>
        ))}
      </div>
    );
    
    // Renderizar os dias da semana
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(firstDayOfWeek);
      currentDay.setDate(firstDayOfWeek.getDate() + i);
      
      // Verificar se é hoje
      const isToday = 
        currentDay.getDate() === new Date().getDate() &&
        currentDay.getMonth() === new Date().getMonth() &&
        currentDay.getFullYear() === new Date().getFullYear();
      
      // Obter processos para esta data
      const processosDodia = getProcessosForDate(currentDay);
      
      weekDays.push(
        <div 
          key={i} 
          className={`min-h-[300px] border p-2 ${
            isToday ? 'bg-primary/10 border-primary' : 'hover:bg-muted/30'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`font-medium ${isToday ? 'text-primary' : ''}`}>
              {currentDay.getDate()} {monthNames[currentDay.getMonth()].substring(0, 3)}
            </span>
            {processosDodia.length > 0 && (
              <Badge variant="secondary">{processosDodia.length}</Badge>
            )}
          </div>
          
          <div className="space-y-2 overflow-y-auto max-h-[250px] calendar-scrollbar">
            {processosDodia.map(processo => {
              const isVenda = 
                processo.dataVenda.getDate() === currentDay.getDate() &&
                processo.dataVenda.getMonth() === currentDay.getMonth() &&
                processo.dataVenda.getFullYear() === currentDay.getFullYear();
              
              const isEntrega = 
                processo.dataPrevistaEntrega.getDate() === currentDay.getDate() &&
                processo.dataPrevistaEntrega.getMonth() === currentDay.getMonth() &&
                processo.dataPrevistaEntrega.getFullYear() === currentDay.getFullYear();
              
              return (
                <Card 
                  key={processo.id} 
                  className="p-2 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onProcessClick(processo)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{processo.numeroPedido}</span>
                    <Badge 
                      style={{ backgroundColor: getEtapaCor(processo.statusAtual) + '20', color: getEtapaCor(processo.statusAtual) }}
                      variant="secondary"
                    >
                      {getEtapaNome(processo.statusAtual)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{processo.cliente}</p>
                  <p className="text-xs mt-1">
                    {isVenda && <span className="text-primary">Venda</span>}
                    {isEntrega && <span className="text-success">Entrega</span>}
                    {': '}
                    {processo.produto}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-1">
        {weekdayHeader}
        <div className="grid grid-cols-7 gap-1">
          {weekDays}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho do calendário */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoje
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <h2 className="text-xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={viewType === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewType('month')}
          >
            Mês
          </Button>
          <Button 
            variant={viewType === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewType('week')}
          >
            Semana
          </Button>
        </div>
      </div>
      
      {/* Conteúdo do calendário */}
      <div className="border rounded-lg p-4 bg-card">
        {viewType === 'month' ? renderMonthCalendar() : renderWeekCalendar()}
      </div>
      
      {/* Legenda */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span>Venda</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <span>Entrega</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;