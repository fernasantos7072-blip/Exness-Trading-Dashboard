import React, { useState, useEffect } from 'react'
import { Calendar, Clock, TrendingUp, AlertTriangle, Info } from 'lucide-react'

interface EconomicEvent {
  id: string
  time: string
  currency: string
  event: string
  importance: 'Low' | 'Medium' | 'High'
  forecast: string
  previous: string
  actual?: string
  impact: 'Bullish' | 'Bearish' | 'Neutral'
  recommendation: string
}

export const EconomicCalendar = () => {
  console.log('EconomicCalendar component rendered')
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  const todayEvents: EconomicEvent[] = [
    {
      id: '1',
      time: '08:30',
      currency: 'USD',
      event: 'Non-Farm Payrolls',
      importance: 'High',
      forecast: '180K',
      previous: '199K',
      actual: '187K',
      impact: 'Bearish',
      recommendation: 'Vender USD pairs - Resultado abaixo das expectativas'
    },
    {
      id: '2',
      time: '10:00',
      currency: 'EUR',
      event: 'German CPI (YoY)',
      importance: 'High',
      forecast: '2.3%',
      previous: '2.4%',
      impact: 'Bullish',
      recommendation: 'Comprar EUR pairs - Inflação controlada favorece EUR'
    },
    {
      id: '3',
      time: '14:00',
      currency: 'USD',
      event: 'Fed Chair Powell Speech',
      importance: 'High',
      forecast: '-',
      previous: '-',
      impact: 'Neutral',
      recommendation: 'Aguardar speech - Pode impactar direção do USD'
    },
    {
      id: '4',
      time: '12:30',
      currency: 'GBP',
      event: 'BoE Interest Rate Decision',
      importance: 'High',
      forecast: '5.25%',
      previous: '5.00%',
      impact: 'Bullish',
      recommendation: 'Comprar GBP pairs - Aumento da taxa esperado'
    },
    {
      id: '5',
      time: '16:00',
      currency: 'CAD',
      event: 'BoC Rate Statement',
      importance: 'Medium',
      forecast: '5.00%',
      previous: '5.00%',
      impact: 'Neutral',
      recommendation: 'Monitorar CAD - Manutenção da taxa prevista'
    },
    {
      id: '6',
      time: '09:45',
      currency: 'CHF',
      event: 'Swiss Unemployment Rate',
      importance: 'Low',
      forecast: '2.0%',
      previous: '2.1%',
      impact: 'Bullish',
      recommendation: 'Leve alta no CHF - Melhora no emprego'
    }
  ]
  
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'High': return 'text-trading-danger'
      case 'Medium': return 'text-trading-warning'
      case 'Low': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Bullish': return 'text-trading-success'
      case 'Bearish': return 'text-trading-danger'
      case 'Neutral': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }
  
  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'Bullish': return <TrendingUp className="w-4 h-4" />
      case 'Bearish': return <TrendingUp className="w-4 h-4 rotate-180" />
      case 'Neutral': return <Info className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }
  
  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-transparent via-purple-900/10 to-black/20 p-6 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-white">Calendário Econômico</h3>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-trading-card border border-trading-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          <h4 className="font-semibold text-white">Estratégia do Dia</h4>
        </div>
        <p className="text-sm text-gray-300">
          Hoje temos eventos de alto impacto para USD, EUR e GBP. Recomendamos operar sempre 
          <span className="text-primary font-semibold"> A FAVOR das notícias</span>. 
          Aguarde os resultados antes de posicionar.
        </p>
      </div>
      
      <div className="space-y-4">
        {todayEvents.map((event) => (
          <div key={event.id} className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-white">{event.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-semibold">
                    {event.currency}
                  </span>
                  <span className={`text-xs font-medium ${getImportanceColor(event.importance)}`}>
                    {event.importance} Impact
                  </span>
                </div>
              </div>
              
              <div className={`flex items-center space-x-1 ${getImpactColor(event.impact)}`}>
                {getImpactIcon(event.impact)}
                <span className="text-sm font-medium">{event.impact}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold text-white mb-2">{event.event}</h4>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Forecast</p>
                  <p className="text-white font-medium">{event.forecast}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Previous</p>
                  <p className="text-white font-medium">{event.previous}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Actual</p>
                  <p className={`font-medium ${event.actual ? 'text-white' : 'text-gray-500'}`}>
                    {event.actual || 'Pending'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <TrendingUp className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Recomendação Trading</p>
                  <p className="text-sm text-white">{event.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-xs text-gray-400">
          Última atualização: {new Date().toLocaleTimeString('pt-BR')} | 
          Dados simulados para demonstração
        </p>
      </div>
    </div>
  )
}