import React from 'react'
import { useBinanceTicker } from '../hooks/useBinanceTicker'
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react'

interface Props {
  symbols?: string[]
}

export const BinanceRealtimeTicker: React.FC<Props> = ({ 
  symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT'] 
}) => {
  console.log('🎯 BinanceRealtimeTicker renderizado para:', symbols)
  
  const { data, status, error } = useBinanceTicker(symbols)

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-green-400'
      case 'connecting': return 'text-yellow-400'
      case 'error': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return <Activity className="w-4 h-4 animate-pulse" />
      case 'connecting': return <Zap className="w-4 h-4 animate-spin" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="bg-black/40 border border-purple-500/30 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Zap className="w-6 h-6 mr-2 text-purple-400" />
          Preços Real-Time Binance
        </h3>
        <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium capitalize">{status}</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
          ❌ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {symbols.map((symbol) => {
          const ticker = data[symbol]
          const price = ticker?.price ?? '—'
          const prev = ticker?.prevPrice
          const priceChange = ticker?.priceChangePercent
          
          let changeSign = ''
          let changeColor = 'text-gray-400'
          
          if (prev) {
            const current = Number(price)
            const previous = Number(prev)
            if (current > previous) {
              changeSign = '▲'
              changeColor = 'text-green-400'
            } else if (current < previous) {
              changeSign = '▼'
              changeColor = 'text-red-400'
            }
          }

          return (
            <div 
              key={symbol} 
              className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 hover:border-purple-400/40 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-white">{symbol}</div>
                {ticker?.eventTime && (
                  <div className="text-xs text-gray-400">
                    {new Date(ticker.eventTime).toLocaleTimeString('pt-BR')}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white font-mono">
                    ${parseFloat(price).toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 8 
                    })}
                  </span>
                  <span className={`text-lg font-bold ${changeColor}`}>
                    {changeSign}
                  </span>
                </div>
                
                {priceChange && (
                  <div className={`text-sm font-medium ${
                    parseFloat(priceChange) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {parseFloat(priceChange) >= 0 ? '+' : ''}{parseFloat(priceChange).toFixed(2)}% (24h)
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-gray-400">Abertura</div>
                    <div className="text-white font-medium">{ticker?.open ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Volume</div>
                    <div className="text-white font-medium">
                      {ticker?.volume ? parseFloat(ticker.volume).toFixed(0) : '—'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-purple-500/20">
        <p className="text-xs text-gray-400 text-center">
          🔌 Conectado via WebSocket à Binance • Atualização em tempo real • Sem necessidade de API Key
        </p>
      </div>
    </div>
  )
}