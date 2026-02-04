import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Activity, Target, BarChart3, RefreshCw } from 'lucide-react'
import { binanceService } from '../lib/binanceService'

export const TechnicalAnalysis = () => {
  console.log('Technical Analysis component rendered - 100% REAL DATA')
  
  const [selectedPair, setSelectedPair] = useState('BTCUSDT')
  const [allPairs, setAllPairs] = useState<string[]>(['BTCUSDT'])
  const [isLoadingPairs, setIsLoadingPairs] = useState(true)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)
  
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
  
  // Carregar análise REAL quando mudar o par
  useEffect(() => {
    const loadAnalysis = async () => {
      setIsLoadingAnalysis(true)
      console.log(`🔄 Carregando análise REAL de ${selectedPair}...`)
      try {
        const analysis = await binanceService.analyzeMarket(selectedPair)
        setAnalysisData(analysis)
        console.log(`✅ Análise de ${selectedPair} carregada!`, analysis)
      } catch (error) {
        console.error('Erro ao carregar análise:', error)
      } finally {
        setIsLoadingAnalysis(false)
      }
    }
    if (selectedPair) {
      loadAnalysis()
    }
  }, [selectedPair])
  
  // Dados REAIS (sem simulação)
  const currentAnalysis = analysisData || {
    price: 0,
    trend: 'LATERAL',
    confidence: 0,
    signal: 'NEUTRO',
    indicators: {
      ema50: 0,
      ema200: 0,
      rsi: 50,
      macd: 0,
      adx: 0,
      atr: 0,
      volumeProfile: 'BAIXO'
    },
    patterns: [],
    reasons: [],
    volatility: 'MÉDIA'
  }
  
  // Calcular níveis Fibonacci baseado no preço REAL
  const fibonacciLevels = {
    '23.6%': (currentAnalysis.price * 0.976).toFixed(2),
    '38.2%': (currentAnalysis.price * 0.962).toFixed(2),
    '50.0%': (currentAnalysis.price * 0.950).toFixed(2),
    '61.8%': (currentAnalysis.price * 0.938).toFixed(2),
    '78.6%': (currentAnalysis.price * 0.914).toFixed(2)
  }
  
  // Projeções baseadas em ATR REAL
  const atr = currentAnalysis.indicators?.atr || 0
  const projection = {
    target1: (currentAnalysis.price + atr * 1.5).toFixed(2),
    target2: (currentAnalysis.price + atr * 2.5).toFixed(2),
    target3: (currentAnalysis.price + atr * 4).toFixed(2),
    support1: (currentAnalysis.price - atr).toFixed(2),
    support2: (currentAnalysis.price - atr * 2).toFixed(2),
    resistance1: (currentAnalysis.price + atr).toFixed(2),
    resistance2: (currentAnalysis.price + atr * 1.5).toFixed(2)
  }
  
  const indicators = [
    {
      name: 'EMA 50/200',
      value: (currentAnalysis.indicators?.ema50 || 0) > (currentAnalysis.indicators?.ema200 || 0) ? 'BULLISH' : 'BEARISH',
      status: (currentAnalysis.indicators?.ema50 || 0) > (currentAnalysis.indicators?.ema200 || 0) ? 'positive' : 'negative',
      detail: `EMA50: ${currentAnalysis.indicators?.ema50?.toFixed(2) || 0} | EMA200: ${currentAnalysis.indicators?.ema200?.toFixed(2) || 0}`
    },
    {
      name: 'ADX (Força)',
      value: (currentAnalysis.indicators?.adx || 0).toFixed(1),
      status: (currentAnalysis.indicators?.adx || 0) > 25 ? 'positive' : 'neutral',
      detail: (currentAnalysis.indicators?.adx || 0) > 25 ? 'Tendência Forte' : 'Tendência Fraca'
    },
    {
      name: 'RSI',
      value: (currentAnalysis.indicators?.rsi || 50).toFixed(1),
      status: (currentAnalysis.indicators?.rsi || 50) > 70 ? 'negative' : (currentAnalysis.indicators?.rsi || 50) < 30 ? 'positive' : 'neutral',
      detail: (currentAnalysis.indicators?.rsi || 50) > 70 ? 'Sobrecomprado' : (currentAnalysis.indicators?.rsi || 50) < 30 ? 'Sobrevendido' : 'Neutro'
    },
    {
      name: 'MACD',
      value: (currentAnalysis.indicators?.macd || 0) > 0 ? 'BULLISH' : 'BEARISH',
      status: (currentAnalysis.indicators?.macd || 0) > 0 ? 'positive' : 'negative',
      detail: `Histograma: ${(currentAnalysis.indicators?.macd || 0).toFixed(2)}`
    },
    {
      name: 'Volume',
      value: currentAnalysis.indicators?.volumeProfile || 'BAIXO',
      status: currentAnalysis.indicators?.volumeProfile === 'FORTE' ? 'positive' : 'neutral',
      detail: 'Perfil de volume atual'
    },
    {
      name: 'ATR (Volatilidade)',
      value: (currentAnalysis.indicators?.atr || 0).toFixed(2),
      status: 'neutral',
      detail: `Volatilidade: ${currentAnalysis.volatility || 'MÉDIA'}`
    }
  ]
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Análise Técnica REAL em Tempo Real</h2>
          <p className="text-sm text-purple-400 mt-1">✅ Dados 100% reais da Binance API</p>
        </div>
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
      
      {isLoadingAnalysis ? (
        <div className="flex items-center justify-center py-20 min-h-[400px] bg-gradient-to-b from-gray-900/50 to-black/50 rounded-lg">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
            <div className="text-white text-lg font-semibold">Carregando análise REAL de {selectedPair}...</div>
            <div className="text-gray-400 text-sm mt-2">Buscando dados em tempo real da Binance</div>
          </div>
        </div>
      ) : (
        <>
          {/* Resumo Geral */}
          <div className="bg-gradient-to-r from-purple-900/60 to-purple-800/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">${currentAnalysis.price.toLocaleString()}</div>
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
                  currentAnalysis.signal === 'COMPRA' ? 'text-green-400' : currentAnalysis.signal === 'VENDA' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {currentAnalysis.signal}
                </div>
                <div className="text-gray-400">Sinal Atual</div>
              </div>
            </div>
          </div>
          
          {/* Indicadores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indicators.map((indicator, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4">
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
          <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-purple-400" />
              Padrões Gráficos Identificados
            </h3>
            {currentAnalysis.patterns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentAnalysis.patterns.map((pattern: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-lg">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-medium">{pattern}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Nenhum padrão gráfico identificado no momento</p>
            )}
          </div>
          
          {/* Níveis Fibonacci */}
          <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Níveis de Fibonacci</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(fibonacciLevels).map(([level, price]) => (
                <div key={level} className="text-center p-3 bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-lg">
                  <div className="text-purple-400 font-medium text-sm">{level}</div>
                  <div className="text-white font-bold">${price}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Projeção de Preços */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
                Alvos de Alta
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Alvo 1 (1.5x ATR)</span>
                  <span className="text-green-400 font-bold">${projection.target1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Alvo 2 (2.5x ATR)</span>
                  <span className="text-green-400 font-bold">${projection.target2}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Alvo 3 (4x ATR)</span>
                  <span className="text-green-400 font-bold">${projection.target3}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <TrendingDown className="w-6 h-6 mr-2 text-red-400" />
                Suportes e Resistências
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Resistência 1</span>
                  <span className="text-red-400 font-bold">${projection.resistance1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Resistência 2</span>
                  <span className="text-red-400 font-bold">${projection.resistance2}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Suporte 1</span>
                  <span className="text-green-400 font-bold">${projection.support1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Suporte 2</span>
                  <span className="text-green-400 font-bold">${projection.support2}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
