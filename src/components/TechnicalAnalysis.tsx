import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Activity, Target, BarChart3 } from 'lucide-react'
import { binanceService } from '../lib/binanceService'

export const TechnicalAnalysis = () => {
  console.log('Technical Analysis component rendered')
  
  const [selectedPair, setSelectedPair] = useState('BTCUSDT')
  const [allPairs, setAllPairs] = useState<string[]>(['BTCUSDT'])
  const [isLoadingPairs, setIsLoadingPairs] = useState(true)
  
  // Buscar TODOS os pares da Binance ao carregar
  useEffect(() => {
    const loadPairs = async () => {
      setIsLoadingPairs(true)
      const pairs = await binanceService.getAllUSDTPairs()
      setAllPairs(pairs)
      setIsLoadingPairs(false)
      console.log(`✅ ${pairs.length} pares carregados para Análise Técnica`)
    }
    loadPairs()
  }, [])
  
    // Generate dynamic analysis data for all pairs
  const generateAnalysisData = (pair: string) => {
    const isBullish = Math.random() > 0.5
    const basePrice = Math.random() * 50000 + 1000
    
    return {
      price: Number(basePrice.toFixed(2)),
      trend: isBullish ? 'BULLISH' : 'BEARISH',
      ema50: 42980.30,
      ema200: 42150.80,
      adx: 28.5,
      rsi: 65.2,
      macd: 145.60,
      atr: 850.25,
      volume: 'ALTA',
      sentiment: 'COMPRA',
      confidence: 87,
      patterns: ['Bandeira Ascendente', 'Rompimento EMA50'],
      fibonacciLevels: {
        '23.6%': 42850.20,
        '38.2%': 42650.10,
        '50.0%': 42400.50,
        '61.8%': 42150.30,
        '78.6%': 41850.80
      },
      projection: {
        target1: 43500.00,
        target2: 43750.00,
        target3: 44000.00,
        support1: 42980.00,
        support2: 42650.00,
        resistance1: 43400.00,
        resistance2: 43650.00
      }
    }
  }
  
  // Pares agora são carregados dinamicamente da Binance via API
  
  const analysisData: Record<string, any> = {}
  allPairs.forEach(pair => {
    analysisData[pair] = generateAnalysisData(pair)
  })
  
  const currentAnalysis = analysisData[selectedPair] || analysisData['BTCUSDT']
  
  const indicators = [
    {
      name: 'EMA 50/200',
      value: currentAnalysis.ema50 > currentAnalysis.ema200 ? 'BULLISH' : 'BEARISH',
      status: currentAnalysis.ema50 > currentAnalysis.ema200 ? 'positive' : 'negative',
      detail: `EMA50: ${currentAnalysis.ema50} | EMA200: ${currentAnalysis.ema200}`
    },
    {
      name: 'ADX (Força)',
      value: currentAnalysis.adx.toString(),
      status: currentAnalysis.adx > 25 ? 'positive' : 'neutral',
      detail: currentAnalysis.adx > 25 ? 'Tendência Forte' : 'Tendência Fraca'
    },
    {
      name: 'RSI',
      value: currentAnalysis.rsi.toString(),
      status: currentAnalysis.rsi > 70 ? 'negative' : currentAnalysis.rsi < 30 ? 'positive' : 'neutral',
      detail: currentAnalysis.rsi > 70 ? 'Sobrecomprado' : currentAnalysis.rsi < 30 ? 'Sobrevendido' : 'Neutro'
    },
    {
      name: 'MACD',
      value: currentAnalysis.macd > 0 ? 'BULLISH' : 'BEARISH',
      status: currentAnalysis.macd > 0 ? 'positive' : 'negative',
      detail: `Histograma: ${currentAnalysis.macd}`
    },
    {
      name: 'Volume',
      value: currentAnalysis.volume,
      status: currentAnalysis.volume === 'ALTA' ? 'positive' : 'neutral',
      detail: 'Confirmando movimento'
    },
    {
      name: 'ATR (Volatilidade)',
      value: currentAnalysis.atr.toString(),
      status: 'neutral',
      detail: 'Volatilidade atual do ativo'
    }
  ]
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Análise Técnica Avançada</h2>
          <select
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            disabled={isLoadingPairs}
            className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
          >
            {isLoadingPairs ? (
              <option>Carregando {allPairs.length} pares...</option>
            ) : (
              allPairs.map(pair => (
                <option key={pair} value={pair}>{pair}</option>
              ))
            )}
          </select>
      </div>
      
      {/* Resumo Geral */}
      <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">${currentAnalysis.price}</div>
            <div className="text-purple-400 font-medium">{selectedPair}</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold mb-2 ${
              currentAnalysis.trend === 'BULLISH' ? 'text-green-400' : 'text-red-400'
            }`}>
              {currentAnalysis.trend}
            </div>
            <div className="text-gray-400">Tendência Geral</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-2">{currentAnalysis.confidence}%</div>
            <div className="text-gray-400">Confiança</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold mb-2 ${
              currentAnalysis.sentiment === 'COMPRA' ? 'text-green-400' : 'text-red-400'
            }`}>
              {currentAnalysis.sentiment}
            </div>
            <div className="text-gray-400">Sinal Atual</div>
          </div>
        </div>
      </div>
      
      {/* Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {indicators.map((indicator, index) => (
          <div key={index} className="bg-black/40 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">{indicator.name}</h4>
              <div className={`w-3 h-3 rounded-full ${
                indicator.status === 'positive' ? 'bg-green-400' :
                indicator.status === 'negative' ? 'bg-red-400' : 'bg-gray-400'
              }`}></div>
            </div>
            <div className="text-lg font-bold text-white mb-1">{indicator.value}</div>
            <div className="text-sm text-gray-400">{indicator.detail}</div>
          </div>
        ))}
      </div>
      
      {/* Padrões Identificados */}
      <div className="bg-black/40 border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-purple-400" />
          Padrões Gráficos Identificados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentAnalysis.patterns.map((pattern, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-purple-500/10 rounded-lg">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-white font-medium">{pattern}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Níveis Fibonacci */}
      <div className="bg-black/40 border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Níveis de Fibonacci</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(currentAnalysis.fibonacciLevels).map(([level, price]) => (
            <div key={level} className="text-center p-3 bg-purple-500/10 rounded-lg">
              <div className="text-purple-400 font-medium text-sm">{level}</div>
              <div className="text-white font-bold">${price}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Projeção de Preços */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/40 border border-green-500/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
            Alvos de Alta
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Alvo 1 (61.8%)</span>
              <span className="text-green-400 font-bold">${currentAnalysis.projection.target1}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Alvo 2 (100%)</span>
              <span className="text-green-400 font-bold">${currentAnalysis.projection.target2}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Alvo 3 (161.8%)</span>
              <span className="text-green-400 font-bold">${currentAnalysis.projection.target3}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 border border-red-500/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <TrendingDown className="w-6 h-6 mr-2 text-red-400" />
            Suportes e Resistências
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Resistência 1</span>
              <span className="text-red-400 font-bold">${currentAnalysis.projection.resistance1}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Resistência 2</span>
              <span className="text-red-400 font-bold">${currentAnalysis.projection.resistance2}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Suporte 1</span>
              <span className="text-green-400 font-bold">${currentAnalysis.projection.support1}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Suporte 2</span>
              <span className="text-green-400 font-bold">${currentAnalysis.projection.support2}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}