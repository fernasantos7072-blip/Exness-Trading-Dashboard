import React, { useState, useEffect } from 'react'
import { Target, TrendingUp, Activity, Zap, BarChart3 } from 'lucide-react'
import { binanceService } from '../lib/binanceService'

export const PriceProjection = () => {
  console.log('Price Projection component rendered')
  
  const [selectedPair, setSelectedPair] = useState('BTCUSDT')
  const [allBinancePairs, setAllBinancePairs] = useState<string[]>(['BTCUSDT'])
  const [isLoadingPairs, setIsLoadingPairs] = useState(true)
  
  // Buscar TODOS os pares da Binance ao carregar
  useEffect(() => {
    const loadPairs = async () => {
      setIsLoadingPairs(true)
      const pairs = await binanceService.getAllUSDTPairs()
      setAllBinancePairs(pairs)
      setIsLoadingPairs(false)
      console.log(`✅ ${pairs.length} pares carregados para Projeção de Preço`)
    }
    loadPairs()
  }, [])
  
  // Pares agora são carregados dinamicamente da Binance via API
  
  const generateProjectionData = (pair: string) => {
    const basePrice = Math.random() * 50000 + 100
    const isBullish = Math.random() > 0.4
    
    return {
      currentPrice: Number(basePrice.toFixed(2)),
      direction: 'BULLISH',
      confidence: 87,
      timeframe: '4H',
      fibLevels: {
        entry: 43200.00,
        tp1: 43450.00, // 61.8%
        tp2: 43600.00, // 100%
        tp3: 43850.00, // 161.8%
        sl: 43149.00
      },
      atrProjection: {
        daily: 1250.30,
        expected: 43750.00,
        volatilityLevel: 'ALTA'
      },
      volumeProfile: {
        level: 'FORTE',
        direction: 'COMPRA',
        bigPlayers: true
      },
      priceAction: {
        pattern: 'BANDEIRA ASCENDENTE',
        type: 'CONTINUAÇÃO',
        reliability: 92
      },
      momentum: {
        roc: 2.45,
        bullPower: 145.60,
        bearPower: -23.40,
        ultimateOsc: 68.5,
        strength: 'FORTE'
      }
    }
  }
  
  const projectionData: Record<string, any> = {}
  allBinancePairs.forEach(pair => {
    projectionData[pair] = generateProjectionData(pair)
  })
  
  const current = projectionData[selectedPair] || projectionData['BTCUSDT']
  
  const riskReward = {
    risk: Math.abs(current.fibLevels.entry - current.fibLevels.sl),
    reward1: Math.abs(current.fibLevels.tp1 - current.fibLevels.entry),
    reward2: Math.abs(current.fibLevels.tp2 - current.fibLevels.entry),
    reward3: Math.abs(current.fibLevels.tp3 - current.fibLevels.entry)
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Projeção de Preço V2.0</h2>
          <select
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            disabled={isLoadingPairs}
            className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
          >
            {isLoadingPairs ? (
              <option>Carregando {allBinancePairs.length} pares...</option>
            ) : (
              allBinancePairs.map(pair => (
                <option key={pair} value={pair}>{pair}</option>
              ))
            )}
          </select>
      </div>
      
      {/* Setup Completo */}
      <div className="bg-gradient-to-r from-purple-900/60 to-purple-800/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Target className="w-6 h-6 mr-2 text-purple-400" />
          Setup Completo - {selectedPair}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">${current.currentPrice}</div>
            <div className="text-gray-400">Preço Atual</div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold mb-2 ${
              current.direction === 'BULLISH' ? 'text-green-400' : 'text-red-400'
            }`}>
              {current.direction}
            </div>
            <div className="text-gray-400">Direção Projetada</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-400 mb-2">{current.confidence}%</div>
            <div className="text-gray-400">Confiança</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-2">{current.timeframe}</div>
            <div className="text-gray-400">Timeframe</div>
          </div>
        </div>
      </div>
      
      {/* Níveis Fibonacci */}
      <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Projeção Fibonacci</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <div className="text-blue-400 font-medium text-sm">ENTRADA</div>
            <div className="text-white font-bold text-lg">${current.fibLevels.entry}</div>
          </div>
          <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
            <div className="text-green-400 font-medium text-sm">TP1 (61.8%)</div>
            <div className="text-white font-bold text-lg">${current.fibLevels.tp1}</div>
            <div className="text-green-400 text-xs">+${current.fibLevels.tp1 - current.fibLevels.entry}</div>
          </div>
          <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
            <div className="text-green-400 font-medium text-sm">TP2 (100%)</div>
            <div className="text-white font-bold text-lg">${current.fibLevels.tp2}</div>
            <div className="text-green-400 text-xs">+${current.fibLevels.tp2 - current.fibLevels.entry}</div>
          </div>
          <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
            <div className="text-green-400 font-medium text-sm">TP3 (161.8%)</div>
            <div className="text-white font-bold text-lg">${current.fibLevels.tp3}</div>
            <div className="text-green-400 text-xs">+${current.fibLevels.tp3 - current.fibLevels.entry}</div>
          </div>
          <div className="text-center p-4 bg-red-500/20 rounded-lg border border-red-500/30">
            <div className="text-red-400 font-medium text-sm">STOP LOSS</div>
            <div className="text-white font-bold text-lg">${current.fibLevels.sl}</div>
            <div className="text-red-400 text-xs">-${current.fibLevels.entry - current.fibLevels.sl}</div>
          </div>
        </div>
        
        {/* Risk/Reward */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-lg">
          <h4 className="text-white font-semibold mb-3">Análise Risk/Reward</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-green-400 font-bold">1:{(riskReward.reward1 / riskReward.risk).toFixed(2)}</div>
              <div className="text-gray-400 text-sm">R/R TP1</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold">1:{(riskReward.reward2 / riskReward.risk).toFixed(2)}</div>
              <div className="text-gray-400 text-sm">R/R TP2</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold">1:{(riskReward.reward3 / riskReward.risk).toFixed(2)}</div>
              <div className="text-gray-400 text-sm">R/R TP3</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ATR e Volatilidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-purple-400" />
            ATR + Volatilidade
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">ATR Diário</span>
              <span className="text-white font-bold">${current.atrProjection.daily}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Projeção ATR</span>
              <span className="text-purple-400 font-bold">${current.atrProjection.expected}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Volatilidade</span>
              <span className={`font-bold ${
                current.atrProjection.volatilityLevel === 'ALTA' ? 'text-red-400' : 'text-green-400'
              }`}>
                {current.atrProjection.volatilityLevel}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-purple-400" />
            Volume Profile
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Nível Volume</span>
              <span className="text-green-400 font-bold">{current.volumeProfile.level}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Direção</span>
              <span className="text-purple-400 font-bold">{current.volumeProfile.direction}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Big Players</span>
              <span className={`font-bold ${current.volumeProfile.bigPlayers ? 'text-green-400' : 'text-red-400'}`}>
                {current.volumeProfile.bigPlayers ? 'SUSTENTANDO' : 'AUSENTES'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Price Action */}
      <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-purple-400" />
          Análise Price Action
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-2">{current.priceAction.pattern}</div>
            <div className="text-gray-400">Padrão Identificado</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-2">{current.priceAction.type}</div>
            <div className="text-gray-400">Tipo</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-400 mb-2">{current.priceAction.reliability}%</div>
            <div className="text-gray-400">Confiabilidade</div>
          </div>
        </div>
      </div>
      
      {/* Momentum */}
      <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-purple-400" />
          Análise de Momentum
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-purple-500/10 rounded-lg">
            <div className="text-purple-400 font-medium text-sm">ROC</div>
            <div className="text-white font-bold">{current.momentum.roc}%</div>
          </div>
          <div className="text-center p-3 bg-green-500/10 rounded-lg">
            <div className="text-green-400 font-medium text-sm">Bull Power</div>
            <div className="text-white font-bold">{current.momentum.bullPower}</div>
          </div>
          <div className="text-center p-3 bg-red-500/10 rounded-lg">
            <div className="text-red-400 font-medium text-sm">Bear Power</div>
            <div className="text-white font-bold">{current.momentum.bearPower}</div>
          </div>
          <div className="text-center p-3 bg-blue-500/10 rounded-lg">
            <div className="text-blue-400 font-medium text-sm">Ultimate Osc</div>
            <div className="text-white font-bold">{current.momentum.ultimateOsc}</div>
          </div>
          <div className="text-center p-3 bg-purple-500/10 rounded-lg">
            <div className="text-purple-400 font-medium text-sm">Força</div>
            <div className="text-white font-bold">{current.momentum.strength}</div>
          </div>
        </div>
      </div>
    </div>
  )
}