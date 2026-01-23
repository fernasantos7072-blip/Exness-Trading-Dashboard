import React, { useState, useEffect } from 'react'
import { Target, TrendingUp, TrendingDown, AlertTriangle, Clock, Zap, XCircle, CheckCircle } from 'lucide-react'
import { binanceService } from '../lib/binanceService'

interface Position {
  id: string
  symbol: string
  direction: 'COMPRA' | 'VENDA'
  entryPrice: number
  currentPrice: number
  targetPrice: number
  stopLoss: number
  entryTime: Date
  confidence: number
  whaleTarget?: number
  whaleDuration?: string
  status: 'ACTIVE' | 'TAKE_PROFIT' | 'STOP_LOSS' | 'CLOSED'
  pnl: number
  isForceChanging: boolean
  forceChangeReason?: string
}

export const ActivePositions = () => {
  const [positions, setPositions] = useState<Position[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  
  useEffect(() => {
    // Load positions from localStorage
    const savedPositions = localStorage.getItem('activePositions')
    if (savedPositions) {
      const parsed = JSON.parse(savedPositions)
      setPositions(parsed.map((p: any) => ({
        ...p,
        entryTime: new Date(p.entryTime)
      })))
    }
    
    // Start monitoring
    if (positions.length > 0) {
      setIsMonitoring(true)
      const interval = setInterval(monitorPositions, 10000) // Check every 10 seconds
      return () => clearInterval(interval)
    }
  }, [positions.length])
  
  const monitorPositions = async () => {
    console.log('🔍 Monitorando posições ativas...')
    
    const updatedPositions = await Promise.all(
      positions.map(async (position) => {
        try {
          // Get current price
          const currentPrice = await binanceService.getCurrentPrice(position.symbol)
          
          // Calculate PNL
          const pnl = position.direction === 'COMPRA'
            ? ((currentPrice - position.entryPrice) / position.entryPrice) * 100
            : ((position.entryPrice - currentPrice) / position.entryPrice) * 100
          
          // Detect force change
          const forceChange = await binanceService.detectForceChange(position.symbol)
          
          let newStatus = position.status
          
          // Check if hit target
          if (position.direction === 'COMPRA' && currentPrice >= position.targetPrice) {
            newStatus = 'TAKE_PROFIT'
          } else if (position.direction === 'VENDA' && currentPrice <= position.targetPrice) {
            newStatus = 'TAKE_PROFIT'
          }
          
          // Check if hit stop loss
          else if (position.direction === 'COMPRA' && currentPrice <= position.stopLoss) {
            newStatus = 'STOP_LOSS'
          } else if (position.direction === 'VENDA' && currentPrice >= position.stopLoss) {
            newStatus = 'STOP_LOSS'
          }
          
          return {
            ...position,
            currentPrice,
            pnl,
            status: newStatus,
            isForceChanging: forceChange.isChanging,
            forceChangeReason: forceChange.reason
          }
        } catch (error) {
          console.error(`Erro ao monitorar ${position.symbol}:`, error)
          return position
        }
      })
    )
    
    setPositions(updatedPositions)
    localStorage.setItem('activePositions', JSON.stringify(updatedPositions))
  }
  
  const closePosition = (positionId: string) => {
    const updatedPositions = positions.map(p =>
      p.id === positionId ? { ...p, status: 'CLOSED' as const } : p
    )
    setPositions(updatedPositions)
    localStorage.setItem('activePositions', JSON.stringify(updatedPositions))
  }
  
  const activePositions = positions.filter(p => p.status === 'ACTIVE')
  const closedPositions = positions.filter(p => p.status !== 'ACTIVE')
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Target className="w-6 h-6 mr-2 text-purple-400" />
          Posições Abertas ({activePositions.length})
        </h2>
        
        {isMonitoring && (
          <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Monitoramento Ativo</span>
          </div>
        )}
      </div>
      
      {activePositions.length === 0 ? (
        <div className="bg-black/40 border border-purple-500/30 rounded-xl p-12 text-center">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Nenhuma posição aberta</p>
          <p className="text-gray-500 text-sm mt-2">Clique em "ENTRAR" em um sinal para abrir uma posição</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {activePositions.map((position) => {
            const isProfitable = position.pnl > 0
            const isNearTarget = position.direction === 'COMPRA' 
              ? position.currentPrice >= position.targetPrice * 0.95
              : position.currentPrice <= position.targetPrice * 1.05
            
            return (
              <div
                key={position.id}
                className={`border rounded-xl p-6 transition-all ${
                  isProfitable
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      isProfitable ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {position.direction === 'COMPRA' ? (
                        <TrendingUp className="w-8 h-8 text-green-400" />
                      ) : (
                        <TrendingDown className="w-8 h-8 text-red-400" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-white">{position.symbol}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          position.direction === 'COMPRA'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {position.direction}
                        </span>
                        <span className="text-gray-400 text-sm">
                          Aberto há {Math.floor((Date.now() - position.entryTime.getTime()) / 60000)} min
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* PNL */}
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${
                      isProfitable ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isProfitable ? '+' : ''}{position.pnl.toFixed(2)}%
                    </div>
                    <div className="text-gray-400 text-sm mt-1">Lucro/Prejuízo</div>
                  </div>
                </div>
                
                {/* Alert de Mudança de Força */}
                {position.isForceChanging && (
                  <div className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-6 h-6 text-yellow-400 mt-0.5" />
                      <div>
                        <div className="text-yellow-400 font-bold mb-1">⚠️ ALERTA: Força Mudando!</div>
                        <p className="text-yellow-300 text-sm">{position.forceChangeReason}</p>
                        <p className="text-yellow-400 text-xs mt-2">
                          💡 Considere fechar a posição manualmente para garantir lucro
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Near Target Alert */}
                {isNearTarget && !position.isForceChanging && (
                  <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium">
                        🎯 Preço próximo do alvo! Faltam apenas {
                          position.direction === 'COMPRA'
                            ? ((position.targetPrice - position.currentPrice) / position.currentPrice * 100).toFixed(2)
                            : ((position.currentPrice - position.targetPrice) / position.currentPrice * 100).toFixed(2)
                        }%
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Price Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Entrada</div>
                    <div className="text-lg font-bold text-white">${position.entryPrice.toFixed(2)}</div>
                  </div>
                  
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Atual</div>
                    <div className={`text-lg font-bold ${
                      isProfitable ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${position.currentPrice.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Alvo (TP)</div>
                    <div className="text-lg font-bold text-green-400">${position.targetPrice.toFixed(2)}</div>
                  </div>
                  
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Stop Loss</div>
                    <div className="text-lg font-bold text-red-400">${position.stopLoss.toFixed(2)}</div>
                  </div>
                </div>
                
                {/* Whale Info */}
                {position.whaleTarget && (
                  <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="text-purple-400 font-bold mb-2">🐋 Projeção da Baleia:</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-400">Alvo da Baleia</div>
                        <div className="text-xl font-bold text-purple-400">${position.whaleTarget.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Duração Estimada</div>
                        <div className="text-lg font-medium text-purple-400">{position.whaleDuration}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Progresso até o alvo</span>
                    <span className={isProfitable ? 'text-green-400' : 'text-red-400'}>
                      {Math.min(100, Math.abs(position.pnl / ((position.targetPrice - position.entryPrice) / position.entryPrice * 100) * 100)).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isProfitable ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.abs(position.pnl / ((position.targetPrice - position.entryPrice) / position.entryPrice * 100) * 100))}%`
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => closePosition(position.id)}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Fechar Posição</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {/* Closed Positions History */}
      {closedPositions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">Histórico de Posições Fechadas</h3>
          <div className="space-y-3">
            {closedPositions.slice(0, 5).map((position) => (
              <div
                key={position.id}
                className="bg-black/40 border border-gray-500/30 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <span className="text-white font-bold">{position.symbol}</span>
                  <span className={`ml-3 px-2 py-1 rounded text-xs ${
                    position.direction === 'COMPRA' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {position.direction}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`text-lg font-bold ${
                    position.pnl > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {position.pnl > 0 ? '+' : ''}{position.pnl.toFixed(2)}%
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    position.status === 'TAKE_PROFIT' ? 'bg-green-500/20 text-green-400' :
                    position.status === 'STOP_LOSS' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {position.status === 'TAKE_PROFIT' ? '✅ TAKE' :
                     position.status === 'STOP_LOSS' ? '🛑 STOP' :
                     '⏹️ MANUAL'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
