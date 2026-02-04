import React, { useState, useEffect } from 'react'
import { useBinanceTicker } from '../hooks/useBinanceTicker'
import { TrendingUp, TrendingDown, Activity, Zap, RefreshCw, Search } from 'lucide-react'
import { binanceService } from '../lib/binanceService'

interface Props {
  symbols?: string[]
}

export const BinanceRealtimeTicker: React.FC<Props> = ({ 
  symbols
}) => {
  const [allPairs, setAllPairs] = useState<string[]>([])
  const [isLoadingPairs, setIsLoadingPairs] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [displayedPairs, setDisplayedPairs] = useState<string[]>([])
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(symbols || [])
  
  // Carregar TODOS os pares da Binance
  useEffect(() => {
    const loadAllPairs = async () => {
      setIsLoadingPairs(true)
      console.log('🔄 Carregando TODOS os pares da Binance para WebSocket...')
      const pairs = await binanceService.getAllUSDTPairs()
      setAllPairs(pairs)
      
      // Se não tiver símbolos fixos, mostrar os 50 principais por volume
      if (!symbols || symbols.length === 0) {
        const topPairs = pairs.slice(0, 50) // Top 50 por padrão
        setSelectedSymbols(topPairs)
        setDisplayedPairs(topPairs)
      } else {
        setDisplayedPairs(symbols)
      }
      
      setIsLoadingPairs(false)
      console.log(`✅ ${pairs.length} pares carregados! Mostrando ${selectedSymbols.length} em tempo real`)
    }
    loadAllPairs()
  }, [])
  
  // Filtrar pares pela busca
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setDisplayedPairs(selectedSymbols)
    } else {
      const filtered = selectedSymbols.filter(symbol => 
        symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setDisplayedPairs(filtered)
    }
  }, [searchTerm, selectedSymbols])
  
  console.log('🎯 BinanceRealtimeTicker renderizado para:', displayedPairs.length, 'pares')
  
  const { data, status, error } = useBinanceTicker(displayedPairs)

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Activity className="w-6 h-6 mr-2 text-purple-400" />
            Todos os Ativos da Binance em Tempo Real
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {isLoadingPairs ? 'Carregando...' : `${allPairs.length} pares disponíveis • Mostrando ${displayedPairs.length} ativos`}
          </p>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getStatusColor()} bg-black/40`}>
          {getStatusIcon()}
          <span className="text-sm font-medium capitalize">{status}</span>
        </div>
      </div>
      
      {/* Busca */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar ativo... (ex: BTC, ETH, ZEC)"
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
        <button
          onClick={() => {
            setSearchTerm('')
            setDisplayedPairs(selectedSymbols)
          }}
          className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400">Limpar</span>
        </button>
      </div>
      
      <div className="bg-black/40 border border-purple-500/30 rounded-xl p-6">

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
            🔌 Conectado via WebSocket à Binance • Atualização em tempo real • {allPairs.length} pares disponíveis • Sem necessidade de API Key
          </p>
        </div>
      </div>
    </div>
  )
}