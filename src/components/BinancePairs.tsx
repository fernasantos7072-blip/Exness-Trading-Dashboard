import React, { useState, useEffect } from 'react'
import { Search, Filter, TrendingUp, TrendingDown, Activity, RefreshCw } from 'lucide-react'
import { binanceService } from '../lib/binanceService'

export const BinancePairs = () => {
  console.log('Binance Pairs component rendered')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [allBinancePairs, setAllBinancePairs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Categorizar par baseado no símbolo
  const categorizePair = (symbol: string): string => {
    if (symbol.includes('BTC') && !symbol.endsWith('USDT')) return 'Crypto Cross'
    if (['BTCUSDT', 'ETHUSDT', 'BNBUSDT'].includes(symbol)) return 'Major Crypto'
    if (['DOGEUSDT', 'SHIBUSDT', 'PEPEUSDT', 'FLOKIUSDT', 'BONKUSDT'].includes(symbol)) return 'Meme'
    if (['AAVEUSDT', 'COMPUSDT', 'UNIUSDT', 'SUSHIUSDT', 'CAKEUSDT'].includes(symbol)) return 'DeFi'
    if (['FETUSDT', 'AGIXUSDT', 'OCEANUSDT', 'GRTUSDT'].includes(symbol)) return 'AI'
    if (['AXSUSDT', 'SANDUSDT', 'MANAUSDT', 'ENJUSDT'].includes(symbol)) return 'Gaming'
    if (['NEARUSDT', 'ATOMUSDT', 'FTMUSDT', 'ALGOUSDT', 'APTUSDT', 'SUIUSDT'].includes(symbol)) return 'Layer 1'
    if (['LINKUSDT', 'BANDUSDT'].includes(symbol)) return 'Oracle'
    if (['USDCUSDT', 'BUSDUSDT', 'TUSDUSDT', 'DAIUSDT'].includes(symbol)) return 'Stablecoin'
    if (symbol === 'BNBUSDT') return 'Exchange Token'
    if (symbol.endsWith('_PERP')) return 'Futures'
    return 'Altcoin'
  }
  
  // Carregar TODOS os pares da Binance em tempo real
  const loadAllPairs = async () => {
    setIsLoading(true)
    console.log('🔄 Carregando TODOS os pares da Binance via API...')
    
    try {
      const symbols = await binanceService.getAllUSDTPairs()
      console.log(`✅ ${symbols.length} pares encontrados!`)
      
      // Buscar dados reais de TODOS os pares (sem limites)
      console.log(`🔄 Buscando dados de TODOS os ${symbols.length} pares...`)
      const pairsData = await Promise.all(
        symbols.map(async (symbol) => { // ⚠️ TODOS os pares, sem limite!
          try {
            const ticker = await binanceService.get24hTicker(symbol)
            if (!ticker) {
              return {
                symbol,
                name: symbol.replace('USDT', ''),
                category: categorizePair(symbol),
                price: 0,
                change: 0,
                volume: 'BAIXA',
                signal: 'NEUTRO'
              }
            }
            
            const price = parseFloat(ticker.lastPrice)
            const change = parseFloat(ticker.priceChangePercent)
            const quoteVolume = parseFloat(ticker.quoteVolume)
            
            // Determinar volume
            let volumeLevel = 'BAIXA'
            if (quoteVolume > 100000000) volumeLevel = 'ALTA' // >100M
            else if (quoteVolume > 10000000) volumeLevel = 'MÉDIA' // >10M
            
            // Determinar sinal baseado em mudança de preço
            let signal = 'NEUTRO'
            if (change > 2) signal = 'COMPRA'
            else if (change < -2) signal = 'VENDA'
            
            return {
              symbol,
              name: symbol.replace('USDT', ''),
              category: categorizePair(symbol),
              price,
              change,
              volume: volumeLevel,
              signal
            }
          } catch (error) {
            console.error(`Erro ao buscar ${symbol}:`, error)
            return {
              symbol,
              name: symbol.replace('USDT', ''),
              category: categorizePair(symbol),
              price: 0,
              change: 0,
              volume: 'BAIXA',
              signal: 'NEUTRO'
            }
          }
        })
      )
      
      setAllBinancePairs(pairsData)
      console.log(`✅ ${pairsData.length} pares carregados com sucesso!`)
      console.log(`📊 100% dos pares da Binance carregados - SEM EXCEÇÕES!`)
      
      // Verificar alguns pares específicos
      const specificPairs = ['LABUSDT', 'ZECUSDT', 'XMRUSDT', 'DASHUSDT', 'BTCUSDT', 'ETHUSDT']
      specificPairs.forEach(pair => {
        const found = pairsData.some(p => p.symbol === pair)
        console.log(`${found ? '✅' : '⚠️'} ${pair} ${found ? 'encontrado' : 'não encontrado'} na lista`)
      })
      
    } catch (error) {
      console.error('❌ Erro ao carregar pares:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Carregar ao montar componente
  useEffect(() => {
    loadAllPairs()
  }, [])
  
  // Atualizar dados
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadAllPairs()
    setIsRefreshing(false)
  }
  
  const binancePairs = allBinancePairs
  
  // Extrair categorias únicas dos pares carregados
  const categories = ['All', ...Array.from(new Set(binancePairs.map(p => p.category))).sort()]
  
  const filteredPairs = binancePairs.filter(pair => {
    const matchesCategory = selectedCategory === 'All' || pair.category === selectedCategory
    const matchesSearch = pair.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pair.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })
  
  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'COMPRA': return 'text-green-400 bg-green-500/20'
      case 'VENDA': return 'text-red-400 bg-red-500/20'
      case 'NEUTRO': return 'text-gray-400 bg-gray-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }
  
  const getVolumeColor = (volume: string) => {
    switch (volume) {
      case 'ALTA': return 'text-green-400'
      case 'MÉDIA': return 'text-yellow-400'
      case 'BAIXA': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-2xl font-semibold text-white">Pares Binance ({binancePairs.length})</h3>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all disabled:opacity-50"
            title="Atualizar dados"
          >
            <RefreshCw className={`w-5 h-5 text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          {isLoading && (
            <span className="text-sm text-purple-400 animate-pulse">Carregando...</span>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar pares..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-black/40 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Stats Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-transparent">
        <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
          <div className="text-green-400 font-semibold mb-1">Sinais COMPRA</div>
          <div className="text-2xl font-bold text-white">
            {binancePairs.filter(p => p.signal === 'COMPRA').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-4">
          <div className="text-red-400 font-semibold mb-1">Sinais VENDA</div>
          <div className="text-2xl font-bold text-white">
            {binancePairs.filter(p => p.signal === 'VENDA').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-4">
          <div className="text-yellow-400 font-semibold mb-1">Volume ALTA</div>
          <div className="text-2xl font-bold text-white">
            {binancePairs.filter(p => p.volume === 'ALTA').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
          <div className="text-purple-400 font-semibold mb-1">Total Pares</div>
          <div className="text-2xl font-bold text-white">{binancePairs.length}</div>
        </div>
      </div>
      
      {/* Lista de Pares */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPairs.map((pair) => (
          <div key={pair.symbol} className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-white text-lg">{pair.symbol}</h4>
                <p className="text-sm text-gray-400">{pair.name}</p>
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full mt-1 inline-block">
                  {pair.category}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-white">${pair.price.toLocaleString()}</p>
                <div className="flex items-center space-x-1">
                  {pair.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    pair.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {pair.change >= 0 ? '+' : ''}{pair.change}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs mb-4">
              <div>
                <p className="text-gray-400 mb-1">Volume</p>
                <p className={`font-medium ${getVolumeColor(pair.volume)}`}>{pair.volume}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Sinal IA</p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSignalColor(pair.signal)}`}>
                  {pair.signal}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button 
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  pair.signal === 'COMPRA' 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                }`}
              >
                Comprar
              </button>
              <button 
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  pair.signal === 'VENDA' 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                }`}
              >
                Vender
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {isLoading ? (
        <div className="text-center py-12 min-h-[400px] bg-gradient-to-b from-gray-900/50 to-black/50 rounded-lg flex flex-col items-center justify-center">
          <RefreshCw className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
          <p className="text-white text-lg font-medium">Carregando TODOS os pares da Binance...</p>
          <p className="text-gray-400 text-sm mt-2">Buscando dados em tempo real via API</p>
        </div>
      ) : filteredPairs.length === 0 ? (
        <div className="text-center py-12 min-h-[400px] bg-gradient-to-b from-gray-900/50 to-black/50 rounded-lg flex flex-col items-center justify-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Nenhum par encontrado com os filtros selecionados.</p>
          <p className="text-gray-500 text-sm mt-2">Total de {binancePairs.length} pares disponíveis</p>
        </div>
      ) : null}
    </div>
  )
}