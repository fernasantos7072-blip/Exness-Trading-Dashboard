import React, { useState, useEffect } from 'react'
import { Activity, TrendingUp, TrendingDown, Zap, Target, BarChart3, RefreshCw, LogIn } from 'lucide-react'
import { binanceService } from '../lib/binanceService'

export const TradingDashboard = () => {
  console.log('Trading Dashboard component rendered')
  
  const [signals, setSignals] = useState<any[]>([])
  const [allSignals, setAllSignals] = useState<any[]>([]) // Histórico de TODOS os sinais (não apaga)
  const [savedSignals, setSavedSignals] = useState<any[]>([]) // Sinais que a pessoa "pegou"
  const [isScanning, setIsScanning] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [scanProgress, setScanProgress] = useState(0)
  const [currentPair, setCurrentPair] = useState('')
  const [totalPairs, setTotalPairs] = useState(0)
  const [scannedPairs, setScannedPairs] = useState(0)
  const [autoScanEnabled] = useState(true) // Sempre ativo, sem controle manual
  const [searchSymbol, setSearchSymbol] = useState('') // Buscar ativo específico
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<any>(null)
  const [allPairsList, setAllPairsList] = useState<string[]>([]) // Lista de TODOS os pares
  
  // NOVO: "PEGUEI ESSE SINAL" - salvar no histórico e monitorar
  const handleTakeSignal = (signal: any) => {
    // Adicionar timestamp
    const savedSignal = {
      ...signal,
      savedAt: new Date().toISOString(),
      status: 'MONITORING'
    }
    
    // Salvar no estado
    const updatedSaved = [...savedSignals, savedSignal]
    setSavedSignals(updatedSaved)
    
    // Salvar no localStorage
    localStorage.setItem('savedSignals', JSON.stringify(updatedSaved))
    
    // Abrir posição automaticamente
    handleEnterPosition(signal)
    
    alert(`✅ Sinal SALVO com sucesso!\n\n📊 ${signal.symbol} - ${signal.signal}\n🎯 Confiança: ${signal.confidence}%\n\nAgora sendo monitorado em tempo real!`)
  }
  
  const handleEnterPosition = (signal: any) => {
    const position = {
      id: `${signal.symbol}_${Date.now()}`,
      symbol: signal.symbol,
      direction: signal.signal,
      entryPrice: signal.price,
      currentPrice: signal.price,
      targetPrice: (signal as any).whaleTarget || (signal.price * (signal.signal === 'COMPRA' ? 1.02 : 0.98)),
      stopLoss: signal.price * (signal.signal === 'COMPRA' ? 0.99 : 1.01),
      entryTime: new Date(),
      confidence: signal.confidence,
      whaleTarget: (signal as any).whaleTarget,
      whaleDuration: (signal as any).whaleDuration,
      status: 'ACTIVE',
      pnl: 0,
      isForceChanging: false
    }
    
    // Save to localStorage
    const existingPositions = JSON.parse(localStorage.getItem('activePositions') || '[]')
    existingPositions.push(position)
    localStorage.setItem('activePositions', JSON.stringify(existingPositions))
  }
  
  // NOVO: Normalizar símbolo para formato Binance (aceita vários formatos)
  const normalizeSymbol = (input: string): string => {
    // Remover espaços e converter para uppercase
    let normalized = input.toUpperCase().trim().replace(/\s+/g, '')
    
    // Se não terminar com USDT, adicionar
    if (!normalized.endsWith('USDT')) {
      normalized = normalized + 'USDT'
    }
    
    return normalized
  }
  
  // NOVO: Buscar ativo específico em tempo real
  const handleSearchSymbol = async () => {
    if (!searchSymbol.trim()) {
      alert('⚠️ Digite o símbolo do ativo\n\nExemplos aceitos:\n• BTC USDT\n• BTCUSDT\n• BTC\n• ETH USD\n• ETHUSDT\n• ZEC\n• ZEC USD')
      return
    }
    
    // Normalizar símbolo (aceita BTC, BTC USD, BTCUSDT, etc)
    const symbol = normalizeSymbol(searchSymbol)
    console.log(`🔍 Input original: "${searchSymbol}" → Normalizado: "${symbol}"`)
    
    setIsSearching(true)
    setSearchResult(null)
    
    try {
      console.log(`🔍 Buscando análise específica para ${symbol}...`)
      
      const analysis = await binanceService.analyzeMarket(symbol)
      const whaleData = await binanceService.detectWhaleMovement(symbol)
      
      // 🐋 SEMPRE a favor das baleias
      if (whaleData.isWhaleActive) {
        const whaleDirection = whaleData.direction === 'BUY' ? 'COMPRA' : whaleData.direction === 'SELL' ? 'VENDA' : 'NEUTRO'
        
        if (analysis.signal !== whaleDirection && analysis.signal !== 'NEUTRO') {
          alert(`⚠️ ${symbol}: Sinal ${analysis.signal} IGNORADO\n\n🐋 Baleia está em ${whaleDirection}\n\nSempre operamos a favor das baleias!`)
          setIsSearching(false)
          return
        }
        
        // Adicionar dados da baleia
        analysis.confidence = Math.max(analysis.confidence, whaleData.confidence)
        analysis.reasons.unshift(
          `🐋 BALEIA ATIVA! Volume: $${(whaleData.volume / 1000000).toFixed(2)}M`,
          `💪 Força: ${whaleData.strength}/100`,
          `🎯 Alvo da Baleia: $${whaleData.priceTarget.toFixed(2)}`,
          `⏱️ Duração Estimada: ${whaleData.estimatedDuration}`
        )
        
        ;(analysis as any).whaleTarget = whaleData.priceTarget
        ;(analysis as any).whaleDuration = whaleData.estimatedDuration
        ;(analysis as any).whaleStrength = whaleData.strength
        
        setSearchResult(analysis)
        alert(`✅ Análise completa de ${symbol} encontrada!\n\n🐋 Baleia Ativa: ${whaleDirection}\n📊 Confiança: ${analysis.confidence}%`)
      } else {
        alert(`⚠️ ${symbol}: Sem atividade de baleia detectada\n\nNão recomendamos operar sem confirmação de baleias.`)
      }
    } catch (error) {
      console.error('Erro ao buscar símbolo:', error)
      alert(`❌ Erro ao analisar ${symbol}\n\nPossíveis causas:\n• Símbolo não existe na Binance\n• Par não está disponível\n• Erro de conexão\n\n💡 Formatos aceitos:\n• BTC USDT\n• BTCUSDT\n• BTC\n• ZEC USD\n• ZECUSDT\n• ETH\n• ETHUSDT`)
    } finally {
      setIsSearching(false)
    }
  }
  
  // Carregar lista de pares e sinais salvos ao iniciar
  useEffect(() => {
    // Carregar sinais salvos
    const saved = localStorage.getItem('savedSignals')
    if (saved) {
      setSavedSignals(JSON.parse(saved))
    }
    
    // Carregar TODOS os pares da Binance
    const loadAllPairs = async () => {
      console.log('🔄 Carregando lista completa de pares da Binance...')
      const pairs = await binanceService.getAllUSDTPairs()
      setAllPairsList(pairs)
      setTotalPairs(pairs.length)
      console.log(`✅ ${pairs.length} pares carregados e prontos para scan!`)
    }
    
    loadAllPairs()
  }, [])
  
  // SCAN AUTOMÁTICO CONTÍNUO (sempre ativo)
  useEffect(() => {
    // Iniciar primeiro scan imediatamente
    scanMarket()
    
    // Configurar loop automático a cada 15 segundos
    const interval = setInterval(() => {
      if (!isScanning) {
        console.log('🔄 Scan automático - a cada 15 segundos...')
        scanMarket()
      }
    }, 15000) // 15 segundos entre scans
    
    return () => clearInterval(interval)
  }, [])
  
  const scanMarket = async () => {
    setIsScanning(true)
    setScanProgress(0)
    setScannedPairs(0)
    setCurrentPair('')
    
    // ⚠️ MOSTRAR DATA/HORA ATUAL DO SCAN
    const now = new Date()
    console.log('🚀 INICIANDO SCAN COMPLETO EM TODOS OS PARES DA BINANCE...')
    console.log(`📅 DATA DO SCAN: ${now.toLocaleDateString('pt-BR')} - HORA: ${now.toLocaleTimeString('pt-BR')}`)
    console.log('⚠️ IMPORTANTE: Análise SEMPRE em TEMPO REAL, NUNCA usa dados antigos!')
    
    try {
      // Se lista de pares ainda não foi carregada, carregar agora
      let pairsToScan = allPairsList
      if (pairsToScan.length === 0) {
        console.log('⚠️ Lista de pares vazia, carregando...')
        pairsToScan = await binanceService.getAllUSDTPairs()
        setAllPairsList(pairsToScan)
        setTotalPairs(pairsToScan.length)
      }
      
      console.log(`📊 Total de pares para escanear: ${pairsToScan.length}`)
      console.log(`🎯 ESCANEANDO **TODOS** OS ${pairsToScan.length} PARES SEM EXCEÇÃO!`)
      console.log(`⚠️ Nenhum par será ignorado - análise 100% completa`)
      
      // Analisar **TODOS** os pares com callback de progresso em tempo real
      const results = await binanceService.scanAllPairs(
        (current, total, symbol) => {
          setScannedPairs(current)
          setCurrentPair(symbol)
          setScanProgress(Math.floor((current / total) * 100))
          
          // Log a cada 50 pares para acompanhamento
          if (current % 50 === 0) {
            console.log(`🔄 Progresso: ${current}/${total} pares (${Math.floor((current/total)*100)}%) - Atual: ${symbol}`)
          }
        }
      )
      
      // ⚠️ NÃO APAGAR sinais anteriores - adicionar aos existentes
      const newSignals = results.filter(newSig => 
        !allSignals.some(existing => existing.symbol === newSig.symbol)
      )
      
      const updatedAllSignals = [...allSignals, ...newSignals]
      setAllSignals(updatedAllSignals)
      setSignals(results) // Sinais atuais do scan
      setLastUpdate(new Date())
      setScanProgress(100)
      
      console.log(`✅ SCAN COMPLETO! ${results.length} sinais encontrados de ${pairsToScan.length} pares`)
      console.log(`📊 Total de sinais acumulados: ${updatedAllSignals.length}`)
      console.log(`🎯 Taxa de detecção: ${((results.length / pairsToScan.length) * 100).toFixed(2)}%`)
      console.log(`🐋 Todos os sinais são com BALEIAS ATIVAS - garantia de qualidade!`)
    } catch (error) {
      console.error('❌ Erro no scan:', error)
    } finally {
      setTimeout(() => {
        setIsScanning(false)
        setScanProgress(0)
        setCurrentPair('')
      }, 2000)
    }
  }
  

  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    })
  }
  
  return (
    <div className="space-y-6">
      {/* Header com Status de Scan */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Activity className="w-6 h-6 mr-2 text-purple-400" />
            Escaneador em Tempo Real - TODOS OS PARES
          </h2>
          <div className="text-sm text-green-400 mt-1 font-medium">
            📅 ANALISANDO DIA: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')} - ⚡ TEMPO REAL
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Scan Automático Ativo (15s)</span>
          </div>
          
          <div className="text-sm text-gray-400">
            Última atualização: {formatTime(lastUpdate)}
          </div>
        </div>
      </div>
      
      {/* NOVO: Buscar Ativo Específico */}
      <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-400" />
          🔍 Analisar Ativo Específico (Sempre a Favor das Baleias)
        </h3>
        <div className="mb-3 text-sm text-gray-300">
          💡 <span className="text-blue-400 font-semibold">Formatos aceitos:</span> BTC, BTC USD, BTCUSDT, ZEC, ETH USDT, ETHUSDT, etc
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
            placeholder="Digite: BTC, BTC USD, BTCUSDT, ZEC, ETH USDT..."
            className="flex-1 bg-black/40 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSymbol()}
          />
          <button
            onClick={handleSearchSymbol}
            disabled={isSearching}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-lg transition-all duration-300 flex items-center space-x-2"
          >
            {isSearching ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Analisando...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Analisar Agora</span>
              </>
            )}
          </button>
        </div>
        {searchResult && (
          <div className="mt-4 p-4 bg-blue-500/10 rounded-lg">
            <div className="text-blue-400 font-bold mb-2">✅ Resultado da busca: {searchResult.symbol}</div>
            <div className="text-white">Sinal: <span className={`font-bold ${
              searchResult.signal === 'COMPRA' ? 'text-green-400' : 'text-red-400'
            }`}>{searchResult.signal}</span> | Confiança: <span className="text-purple-400 font-bold">{searchResult.confidence}%</span></div>
          </div>
        )}
      </div>
      
      {/* Barra de Progresso REAL */}
      {isScanning && (
        <div className="bg-black/40 border border-purple-500/30 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-bold text-lg mb-1">
                  Escaneando TODOS os pares da Binance em tempo real...
                </div>
                <div className="text-purple-400 text-sm">
                  🔍 Atual: <span className="font-mono">{currentPair || 'Carregando...'}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-400">{scanProgress}%</div>
                <div className="text-sm text-gray-400">
                  {scannedPairs} / {totalPairs} pares
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 h-3 rounded-full transition-all duration-300 animate-pulse"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">🐋 Detectando baleias em tempo real</span>
              <span className="text-green-400 animate-pulse">● Escaneamento ativo</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Status do Scan Automático */}
      {!isScanning && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">
                ♻️ SCAN AUTOMÁTICO CONTÍNUO - Próximo scan em 15 segundos
              </span>
            </div>
            <span className="text-gray-400 text-sm">
              Última varredura: {signals.length} sinais encontrados em {totalPairs} pares
            </span>
          </div>
        </div>
      )}
      
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-400">{signals.filter(s => s.signal === 'COMPRA').length}</div>
              <div className="text-green-400 text-sm mt-1">Sinais de COMPRA</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-400">{signals.filter(s => s.signal === 'VENDA').length}</div>
              <div className="text-red-400 text-sm mt-1">Sinais de VENDA</div>
            </div>
            <TrendingDown className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-400">{signals.length}</div>
              <div className="text-purple-400 text-sm mt-1">Total de Sinais</div>
            </div>
            <Target className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-yellow-400">
                {signals.length > 0 ? Math.round(signals.reduce((acc, s) => acc + s.confidence, 0) / signals.length) : 0}%
              </div>
              <div className="text-yellow-400 text-sm mt-1">Confiança Média</div>
            </div>
            <BarChart3 className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>
      
      {/* Sinais Recentes */}
      <div className="bg-black/40 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Zap className="w-6 h-6 mr-2 text-purple-400" />
            Sinais Encontrados (TODOS - Nunca Apagam)
          </h3>
          <div className="text-sm text-purple-400">
            📊 Total acumulado: {allSignals.length} sinais | 💾 Salvos: {savedSignals.length}
          </div>
        </div>
        
        {/* Mostrar resultado da busca específica primeiro */}
        {searchResult && (
          <div className="mb-6 border-2 border-blue-500 rounded-xl p-6 bg-blue-500/10">
            <div className="text-blue-400 font-bold text-lg mb-4">🎯 Resultado da Busca Específica</div>
            <div 
              className={`border rounded-xl p-5 transition-all ${
                searchResult.signal === 'COMPRA' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              {/* Mesmo layout do sinal normal */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    searchResult.signal === 'COMPRA' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {searchResult.signal === 'COMPRA' ? (
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{searchResult.symbol}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        searchResult.signal === 'COMPRA' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {searchResult.signal}
                      </span>
                      <span className="text-gray-400 text-sm">{searchResult.bestTimeframe}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">${searchResult.price.toLocaleString()}</div>
                  <div className={`text-sm font-medium ${
                    searchResult.trend === 'BULLISH' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {searchResult.trend}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="text-sm font-semibold text-purple-400">Análise Completa:</div>
                {searchResult.reasons.map((reason: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-2 text-sm">
                    <Target className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{reason}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => handleTakeSignal(searchResult)}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Target className="w-5 h-5" />
                  <span>PEGUEI ESSE SINAL</span>
                </button>
                <button
                  onClick={() => handleEnterPosition(searchResult)}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-5 h-5" />
                  <span>ENTRAR</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {allSignals.length === 0 ? (
          <div className="text-center py-12 min-h-[300px] flex flex-col items-center justify-center">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-400 text-lg">Iniciando scan automático...</p>
            <p className="text-gray-500 text-sm mt-2">O sistema escaneia todos os pares a cada 15 segundos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {allSignals.sort((a, b) => b.confidence - a.confidence).map((signal, index) => (
              <div 
                key={index} 
                className={`border rounded-xl p-5 transition-all ${
                  signal.signal === 'COMPRA' 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      signal.signal === 'COMPRA' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {signal.signal === 'COMPRA' ? (
                        <TrendingUp className="w-6 h-6 text-green-400" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{signal.symbol}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          signal.signal === 'COMPRA' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {signal.signal}
                        </span>
                        <span className="text-gray-400 text-sm">{signal.bestTimeframe}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">${signal.price.toLocaleString()}</div>
                    <div className={`text-sm font-medium ${
                      signal.trend === 'BULLISH' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {signal.trend}
                    </div>
                  </div>
                </div>
                
                {/* Indicadores */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  <div className="text-center p-2 bg-black/20 rounded-lg">
                    <div className="text-xs text-gray-400">Confiança</div>
                    <div className="text-lg font-bold text-purple-400">{signal.confidence}%</div>
                  </div>
                  <div className="text-center p-2 bg-black/20 rounded-lg">
                    <div className="text-xs text-gray-400">RSI</div>
                    <div className="text-lg font-bold text-white">{signal.indicators.rsi.toFixed(1)}</div>
                  </div>
                  <div className="text-center p-2 bg-black/20 rounded-lg">
                    <div className="text-xs text-gray-400">ADX</div>
                    <div className="text-lg font-bold text-white">{signal.indicators.adx.toFixed(1)}</div>
                  </div>
                  <div className="text-center p-2 bg-black/20 rounded-lg">
                    <div className="text-xs text-gray-400">Volatilidade</div>
                    <div className="text-lg font-bold text-yellow-400">{signal.volatility}</div>
                  </div>
                  <div className="text-center p-2 bg-black/20 rounded-lg">
                    <div className="text-xs text-gray-400">Probabilidade</div>
                    <div className="text-lg font-bold text-green-400">{signal.probability}%</div>
                  </div>
                </div>
                
                {/* Razões */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-purple-400">Análise Completa:</div>
                  {signal.reasons.map((reason: string, idx: number) => (
                    <div key={idx} className="flex items-start space-x-2 text-sm">
                      <Target className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{reason}</span>
                    </div>
                  ))}
                </div>
                
                {/* Alvo da Baleia */}
                {(signal as any).whaleTarget && (
                  <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="text-purple-400 font-bold mb-2">🐋 Projeção da Baleia:</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-400">Alvo</div>
                        <div className="text-xl font-bold text-purple-400">${(signal as any).whaleTarget.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Duração</div>
                        <div className="text-lg font-medium text-purple-400">{(signal as any).whaleDuration}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Horário de Entrada + Botão ENTRAR */}
                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-gray-400 text-sm">Entrada Recomendada:</span>
                      <span className="text-white font-bold ml-2">{signal.entryTime}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 text-sm">Padrões:</span>
                      <span className="text-purple-400 font-medium ml-2">
                        {signal.patterns.length} detectados
                      </span>
                    </div>
                  </div>
                  
                  {/* NOVO: Dois botões - PEGUEI ESSE SINAL + ENTRAR */}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleTakeSignal(signal)}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Target className="w-5 h-5" />
                      <span>PEGUEI ESSE SINAL</span>
                    </button>
                    <button
                      onClick={() => handleEnterPosition(signal)}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>ENTRAR</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
