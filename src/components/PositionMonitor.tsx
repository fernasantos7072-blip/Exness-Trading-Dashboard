import React, { useState, useEffect } from 'react'
import { TrendingDown, AlertTriangle, CheckCircle, Target, Brain, Clock, Zap } from 'lucide-react'

export const PositionMonitor = () => {
  console.log('Position Monitor component rendered')
  
  const [activePosition, setActivePosition] = useState({
    pair: 'BTCUSDT',
    direction: 'LONG',
    entryPrice: 43200.00,
    currentPrice: 43250.50,
    pnl: 50.50,
    pnlPercent: 0.12,
    timeInTrade: '15:23',
    confidence: 87,
    targetPrice: 46850.00,
    stopLoss: 43199.00
  })
  
  const [exitAnalysis, setExitAnalysis] = useState({
    shouldExit: false,
    urgency: 'low', // low, medium, high
    reasons: [],
    aiConfidence: 0,
    priceTarget: 0,
    timeframe: '',
    globalResearch: []
  })
  
  // Simular análise contínua da posição
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular mudança de preço
      const priceChange = (Math.random() - 0.5) * 100
      const newPrice = activePosition.currentPrice + priceChange
      const newPnl = newPrice - activePosition.entryPrice
      const newPnlPercent = (newPnl / activePosition.entryPrice) * 100
      
      setActivePosition(prev => ({
        ...prev,
        currentPrice: newPrice,
        pnl: newPnl,
        pnlPercent: newPnlPercent
      }))
      
      // IA analisa se deve sair
      analyzeExitConditions(newPrice, newPnlPercent)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  const analyzeExitConditions = (currentPrice: number, pnlPercent: number) => {
    // Simular diferentes cenários de saída
    const scenarios = [
      {
        shouldExit: false,
        urgency: 'low',
        reasons: [
          '✅ Tendência ainda forte (EMA50 > EMA200)',
          '✅ Volume sustentando movimento',
          '✅ RSI em zona saudável (55)',
          '✅ Sem notícias negativas nas últimas 2h'
        ],
        aiConfidence: 92,
        priceTarget: 46850,
        timeframe: '6-12 horas',
        globalResearch: [
          { source: 'YouTube', content: '5 analistas preveem alta para $47k', sentiment: 'BULLISH' },
          { source: 'Twitter', content: 'Whales acumulando, volume on-chain alto', sentiment: 'BULLISH' },
          { source: 'News', content: 'ETF approval rumors strengthening', sentiment: 'BULLISH' }
        ]
      },
      {
        shouldExit: true,
        urgency: 'medium',
        reasons: [
          '⚠️ RSI atingiu sobrecompra (78) - possível correção',
          '⚠️ Volume caindo 30% nas últimas 3 velas',
          '⚠️ Formação de Shooting Star no topo',
          '⚠️ Divergência bearish no MACD',
          '✅ Já está em +0.12% de lucro'
        ],
        aiConfidence: 76,
        priceTarget: currentPrice - 50,
        timeframe: '15-30 minutos',
        globalResearch: [
          { source: 'Google Trends', content: 'Buscas por "sell bitcoin" aumentaram 40%', sentiment: 'BEARISH' },
          { source: 'YouTube', content: '3 traders alertando sobre topo de curto prazo', sentiment: 'BEARISH' },
          { source: 'Reddit', content: 'Sentimento mudou de "greedy" para "neutral"', sentiment: 'NEUTRAL' }
        ]
      },
      {
        shouldExit: true,
        urgency: 'high',
        reasons: [
          '🚨 ALERTA: Notícia negativa forte publicada há 5 min',
          '🚨 Volume de venda massivo detectado',
          '🚨 Rompimento de suporte importante ($43,150)',
          '🚨 Grandes players vendendo (análise on-chain)',
          '⚠️ Padrão de reversão formado (Ombro-Cabeça-Ombro)'
        ],
        aiConfidence: 94,
        priceTarget: currentPrice - 200,
        timeframe: 'IMEDIATO',
        globalResearch: [
          { source: 'Breaking News', content: 'SEC anuncia investigação sobre exchanges', sentiment: 'VERY_BEARISH' },
          { source: 'Whale Alert', content: '10.000 BTC movidos para exchanges', sentiment: 'BEARISH' },
          { source: 'YouTube Live', content: 'Traders institucionais saindo em massa', sentiment: 'BEARISH' }
        ]
      }
    ]
    
    // Escolher cenário baseado em probabilidade
    const rand = Math.random()
    let scenario
    if (rand < 0.7) {
      scenario = scenarios[0] // 70% - tudo ok
    } else if (rand < 0.9) {
      scenario = scenarios[1] // 20% - atenção
    } else {
      scenario = scenarios[2] // 10% - alerta alto
    }
    
    setExitAnalysis(scenario)
  }
  
  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return 'border-red-500/50 bg-red-500/10'
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10'
      default: return 'border-green-500/50 bg-green-500/10'
    }
  }
  
  const getUrgencyIcon = (urgency: string) => {
    switch(urgency) {
      case 'high': return <AlertTriangle className="w-6 h-6 text-red-400" />
      case 'medium': return <Clock className="w-6 h-6 text-yellow-400" />
      default: return <CheckCircle className="w-6 h-6 text-green-400" />
    }
  }
  
  const getSentimentColor = (sentiment: string) => {
    switch(sentiment) {
      case 'VERY_BEARISH': return 'text-red-600 font-bold'
      case 'BEARISH': return 'text-red-400'
      case 'NEUTRAL': return 'text-gray-400'
      case 'BULLISH': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Target className="w-6 h-6 mr-2 text-purple-400" />
          Monitor de Posição IA
        </h2>
        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-green-500/20 text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Posição Ativa</span>
        </div>
      </div>
      
      {/* Posição Atual */}
      <div className="bg-black/40 border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Posição Atual</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">Par</p>
            <p className="text-white font-bold text-xl">{activePosition.pair}</p>
            <p className={`text-sm font-medium ${
              activePosition.direction === 'LONG' ? 'text-green-400' : 'text-red-400'
            }`}>
              {activePosition.direction}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Preço de Entrada</p>
            <p className="text-white font-bold text-xl">${activePosition.entryPrice.toLocaleString()}</p>
            <p className="text-sm text-purple-400">Confiança: {activePosition.confidence}%</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Preço Atual</p>
            <p className="text-white font-bold text-xl">${activePosition.currentPrice.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Tempo: {activePosition.timeInTrade}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">P&L</p>
            <p className={`font-bold text-xl ${
              activePosition.pnl >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {activePosition.pnl >= 0 ? '+' : ''}${activePosition.pnl.toFixed(2)}
            </p>
            <p className={`text-sm ${
              activePosition.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {activePosition.pnlPercent >= 0 ? '+' : ''}{activePosition.pnlPercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
      
      {/* Análise de Saída IA */}
      <div className={`border-2 rounded-xl p-6 ${getUrgencyColor(exitAnalysis.urgency)}`}>
        <div className="flex items-center space-x-3 mb-4">
          {getUrgencyIcon(exitAnalysis.urgency)}
          <h3 className="text-xl font-semibold text-white">
            {exitAnalysis.shouldExit ? '⚠️ ANÁLISE: CONSIDERE SAIR' : '✅ ANÁLISE: MANTENHA POSIÇÃO'}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Confiança IA</p>
            <p className="text-2xl font-bold text-purple-400">{exitAnalysis.aiConfidence}%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Projeção Preço</p>
            <p className="text-2xl font-bold text-white">${exitAnalysis.priceTarget.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Timeframe</p>
            <p className="text-2xl font-bold text-yellow-400">{exitAnalysis.timeframe}</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <h4 className="font-semibold text-white flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            Razões da Análise:
          </h4>
          {exitAnalysis.reasons.map((reason, index) => (
            <div key={index} className="flex items-start space-x-2 p-3 bg-black/20 rounded-lg">
              <span className="text-white">{reason}</span>
            </div>
          ))}
        </div>
        
        {exitAnalysis.shouldExit && (
          <div className="bg-black/40 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-yellow-400 mb-2 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              RECOMENDAÇÃO:
            </h4>
            <p className="text-white">
              {exitAnalysis.urgency === 'high' ? (
                '🚨 FECHE A POSIÇÃO AGORA! Risco de reversão forte detectado. Saia com lucro enquanto é possível.'
              ) : (
                '⚠️ Considere fechar parcialmente (50%) e proteger lucros. Ajuste stop loss para breakeven.'
              )}
            </p>
          </div>
        )}
        
        {/* Pesquisa Global IA */}
        <div className="border-t border-purple-500/20 pt-4">
          <h4 className="font-semibold text-white mb-3 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            Pesquisa Global IA (YouTube, Google, Twitter, News):
          </h4>
          <div className="space-y-3">
            {exitAnalysis.globalResearch.map((research, index) => (
              <div key={index} className="p-3 bg-black/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-400 font-medium text-sm">{research.source}</span>
                  <span className={`text-sm font-bold ${getSentimentColor(research.sentiment)}`}>
                    {research.sentiment}
                  </span>
                </div>
                <p className="text-white text-sm">{research.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Botões de Ação */}
      {exitAnalysis.shouldExit && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all">
            🚨 Fechar Posição Agora
          </button>
          <button className="py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-all">
            ⚡ Fechar 50% e Proteger
          </button>
          <button className="py-3 px-6 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-all">
            🎯 Ignorar e Manter
          </button>
        </div>
      )}
    </div>
  )
}