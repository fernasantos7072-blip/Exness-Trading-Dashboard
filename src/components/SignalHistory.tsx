import React, { useState } from 'react'
import { History, TrendingUp, TrendingDown, Target, Clock, Filter } from 'lucide-react'

export const SignalHistory = () => {
  console.log('Signal History component rendered')
  
  const [filterStatus, setFilterStatus] = useState('All')
  
  const signalHistory = [
    {
      id: 1,
      timestamp: '2024-01-15 14:30:25',
      pair: 'BTCUSDT',
      direction: 'LONG',
      entry: 43200.50,
      sl: 43199.50,
      tp: 43203.70,
      confidence: 87,
      timeframe: '5m',
      status: 'WIN',
      pnl: 3.20,
      exitPrice: 43203.70,
      exitTime: '2024-01-15 14:45:12',
      reason: 'TP atingido'
    },
    {
      id: 2,
      timestamp: '2024-01-15 13:15:10',
      pair: 'ETHUSDT',
      direction: 'SHORT',
      entry: 2635.80,
      sl: 2636.80,
      tp: 2632.60,
      confidence: 82,
      timeframe: '15m',
      status: 'LOSS',
      pnl: -1.00,
      exitPrice: 2636.80,
      exitTime: '2024-01-15 13:18:45',
      reason: 'SL atingido'
    },
    {
      id: 3,
      timestamp: '2024-01-15 12:45:30',
      pair: 'BNBUSDT',
      direction: 'LONG',
      entry: 312.45,
      sl: 311.45,
      tp: 314.45,
      confidence: 79,
      timeframe: '5m',
      status: 'WIN',
      pnl: 2.00,
      exitPrice: 314.45,
      exitTime: '2024-01-15 12:52:15',
      reason: 'TP atingido'
    },
    {
      id: 4,
      timestamp: '2024-01-15 11:20:45',
      pair: 'ADAUSDT',
      direction: 'LONG',
      entry: 0.4523,
      sl: 0.4522,
      tp: 0.4526,
      confidence: 91,
      timeframe: '5m',
      status: 'WIN',
      pnl: 3.00,
      exitPrice: 0.4526,
      exitTime: '2024-01-15 11:28:20',
      reason: 'TP atingido'
    },
    {
      id: 5,
      timestamp: '2024-01-15 10:55:15',
      pair: 'XRPUSDT',
      direction: 'SHORT',
      entry: 0.5634,
      sl: 0.5635,
      tp: 0.5631,
      confidence: 85,
      timeframe: '15m',
      status: 'ACTIVE',
      pnl: 0,
      exitPrice: null,
      exitTime: null,
      reason: 'Em andamento'
    },
    {
      id: 6,
      timestamp: '2024-01-15 09:30:20',
      pair: 'SOLUSDT',
      direction: 'LONG',
      entry: 98.76,
      sl: 97.76,
      tp: 100.76,
      confidence: 88,
      timeframe: '5m',
      status: 'WIN',
      pnl: 2.00,
      exitPrice: 100.76,
      exitTime: '2024-01-15 09:38:45',
      reason: 'TP atingido'
    },
    {
      id: 7,
      timestamp: '2024-01-15 08:15:30',
      pair: 'DOTUSDT',
      direction: 'SHORT',
      entry: 6.78,
      sl: 6.79,
      tp: 6.75,
      confidence: 76,
      timeframe: '15m',
      status: 'LOSS',
      pnl: -1.00,
      exitPrice: 6.79,
      exitTime: '2024-01-15 08:22:10',
      reason: 'SL atingido'
    },
    {
      id: 8,
      timestamp: '2024-01-15 07:45:15',
      pair: 'AVAXUSDT',
      direction: 'LONG',
      entry: 34.56,
      sl: 33.56,
      tp: 36.56,
      confidence: 83,
      timeframe: '5m',
      status: 'WIN',
      pnl: 2.00,
      exitPrice: 36.56,
      exitTime: '2024-01-15 07:52:30',
      reason: 'TP atingido'
    }
  ]
  
  const filteredSignals = signalHistory.filter(signal => {
    if (filterStatus === 'All') return true
    return signal.status === filterStatus
  })
  
  const stats = {
    total: signalHistory.length,
    wins: signalHistory.filter(s => s.status === 'WIN').length,
    losses: signalHistory.filter(s => s.status === 'LOSS').length,
    active: signalHistory.filter(s => s.status === 'ACTIVE').length,
    totalPnL: signalHistory.reduce((sum, s) => sum + s.pnl, 0),
    winRate: ((signalHistory.filter(s => s.status === 'WIN').length / signalHistory.filter(s => s.status !== 'ACTIVE').length) * 100).toFixed(1)
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WIN': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'LOSS': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'ACTIVE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }
  
  const getDirectionColor = (direction: string) => {
    return direction === 'LONG' ? 'text-green-400' : 'text-red-400'
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <History className="w-6 h-6 mr-2 text-purple-400" />
          Histórico de Sinais
        </h2>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-black/40 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="All">Todos</option>
            <option value="WIN">Vitórias</option>
            <option value="LOSS">Perdas</option>
            <option value="ACTIVE">Ativos</option>
          </select>
        </div>
      </div>
      
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-black/40 border border-purple-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-gray-400">Total</div>
        </div>
        <div className="bg-black/40 border border-green-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.wins}</div>
          <div className="text-sm text-gray-400">Vitórias</div>
        </div>
        <div className="bg-black/40 border border-red-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.losses}</div>
          <div className="text-sm text-gray-400">Perdas</div>
        </div>
        <div className="bg-black/40 border border-yellow-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.active}</div>
          <div className="text-sm text-gray-400">Ativos</div>
        </div>
        <div className="bg-black/40 border border-purple-500/30 rounded-lg p-4 text-center">
          <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">P&L Total</div>
        </div>
        <div className="bg-black/40 border border-blue-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.winRate}%</div>
          <div className="text-sm text-gray-400">Win Rate</div>
        </div>
      </div>
      
      {/* Lista de Sinais */}
      <div className="space-y-4">
        {filteredSignals.map((signal) => (
          <div key={signal.id} className="bg-black/40 border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-lg">{signal.pair}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    signal.direction === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {signal.direction}
                  </span>
                  <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(signal.status)}`}>
                    {signal.status}
                  </span>
                </div>
                <div className="text-purple-400 font-bold">{signal.confidence}%</div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{signal.timestamp}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{signal.timeframe}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Entrada</p>
                <p className="text-white font-medium">${signal.entry}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Stop Loss</p>
                <p className="text-red-400 font-medium">${signal.sl}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Take Profit</p>
                <p className="text-green-400 font-medium">${signal.tp}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Saída</p>
                <p className="text-white font-medium">
                  {signal.exitPrice ? `$${signal.exitPrice}` : 'Em andamento'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">P&L</p>
                <p className={`font-bold ${
                  signal.pnl > 0 ? 'text-green-400' : signal.pnl < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {signal.pnl > 0 ? '+' : ''}${signal.pnl.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Resultado</p>
                <p className="text-white font-medium text-xs">{signal.reason}</p>
              </div>
            </div>
            
            {signal.exitTime && (
              <div className="mt-3 pt-3 border-t border-purple-500/20">
                <p className="text-xs text-gray-400">
                  Finalizado em: {signal.exitTime}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {filteredSignals.length === 0 && (
        <div className="text-center py-12">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Nenhum sinal encontrado com o filtro selecionado.</p>
        </div>
      )}
    </div>
  )
}