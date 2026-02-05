import React, { useState } from 'react'
import { Header } from './components/Header'
import { TradingDashboard } from './components/TradingDashboard'
import { TechnicalAnalysis } from './components/TechnicalAnalysis'
import { BinancePairs } from './components/BinancePairs'
import { EconomicCalendar } from './components/EconomicCalendar'
import { TradingNews } from './components/TradingNews'
import { TelegramIntegration } from './components/TelegramIntegration'
import { SignalHistory } from './components/SignalHistory'
import { TradingStrategy } from './components/TradingStrategy'
import { APIConnections } from './components/APIConnections'
import { PositionMonitor } from './components/PositionMonitor'
import { AccountBalance } from './components/AccountBalance'
import { BinanceRealtimeTicker } from './components/BinanceRealtimeTicker'
import { ActivePositions } from './components/ActivePositions'
import { CurrentDateDisplay } from './components/CurrentDateDisplay'
import { Button } from './components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Newspaper, 
  Send, 
  History,
  Brain,
  Target,
  Activity,
  Zap,
  Settings
} from 'lucide-react'

function App() {
  console.log('PRISMA IA Trading System - v2.0')
  
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'realtime', label: 'Todos Ativos Binance', icon: <Activity className="w-4 h-4" /> },
    { id: 'analysis', label: 'Análise Técnica', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'pairs', label: 'Pares Binance', icon: <Activity className="w-4 h-4" /> },
    { id: 'strategy', label: 'Estratégia V2.0', icon: <Brain className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendário', icon: <Calendar className="w-4 h-4" /> },
    { id: 'news', label: 'Notícias', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'telegram', label: 'Telegram', icon: <Send className="w-4 h-4" /> },
    { id: 'signals', label: 'Histórico', icon: <History className="w-4 h-4" /> },
    { id: 'api', label: 'Conexões API', icon: <Zap className="w-4 h-4" /> },
    { id: 'positions', label: 'Posições Abertas', icon: <Target className="w-4 h-4" /> },
    { id: 'monitor', label: 'Monitor Posição', icon: <Target className="w-4 h-4" /> }
  ]
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <CurrentDateDisplay />
            <AccountBalance />
            <TradingDashboard />
          </div>
        )
      case 'realtime':
        return <BinanceRealtimeTicker />
      case 'analysis':
        return <TechnicalAnalysis />
      case 'pairs':
        return <BinancePairs />
      case 'strategy':
        return <TradingStrategy />
      case 'calendar':
        return <EconomicCalendar />
      case 'news':
        return <TradingNews />
      case 'telegram':
        return <TelegramIntegration />
      case 'signals':
        return <SignalHistory />
      case 'api':
        return <APIConnections />
      case 'positions':
        return <ActivePositions />
      case 'monitor':
        return <PositionMonitor />
      default:
        return (
          <div className="space-y-6">
            <CurrentDateDisplay />
            <AccountBalance />
            <TradingDashboard />
          </div>
        )
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/98 via-purple-900/95 to-black/98 relative">
      <Header />
      
      {/* Navigation Tabs */}
      <div className="border-b border-purple-500/30 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`flex items-center space-x-2 whitespace-nowrap px-4 py-3 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' 
                    : 'text-gray-400 hover:text-white hover:bg-purple-500/20'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8 bg-gradient-to-b from-black/30 via-purple-900/10 to-black/30 backdrop-blur-md min-h-screen relative z-10">
        <div className="animate-fade-in bg-gradient-to-b from-gray-900/40 via-purple-900/20 to-black/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/10">
          {renderContent()}
        </div>
      </main>
      
      {/* PRISMA IA Status */}
      <div className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl shadow-2xl shadow-purple-500/25 border border-purple-500/30">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <p className="font-semibold text-sm">
            PRISMA IA - Sistema Ativo
          </p>
        </div>
      </div>
    </div>
  )
}

export default App