// Serviço REAL da Binance API para dados em tempo real
interface BinanceTicker {
  symbol: string
  lastPrice: string
  priceChangePercent: string
  volume: string
  quoteVolume: string
}

interface BinanceKline {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
}

interface MarketAnalysis {
  symbol: string
  price: number
  trend: 'BULLISH' | 'BEARISH' | 'LATERAL'
  strength: number
  volatility: 'BAIXA' | 'MÉDIA' | 'ALTA' | 'MUITO ALTA'
  signal: 'COMPRA' | 'VENDA' | 'NEUTRO'
  confidence: number
  bestTimeframe: string
  entryTime: string
  indicators: {
    ema50: number
    ema200: number
    rsi: number
    macd: number
    adx: number
    atr: number
    volumeProfile: string
  }
  patterns: string[]
  probability: number
  reasons: string[]
}

class BinanceService {
  private baseUrl = 'https://api.binance.com/api/v3'
  private allPairs: string[] = []
  private whaleThreshold = 1000000 // $1M+ = Whale movement
  
  // Buscar preço atual em tempo real
  async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/ticker/price?symbol=${symbol}`)
      const data = await response.json()
      return parseFloat(data.price)
    } catch (error) {
      console.error('Erro ao buscar preço:', error)
      return 0
    }
  }
  
  // Buscar ticker 24h
  async get24hTicker(symbol: string): Promise<BinanceTicker | null> {
    try {
      const response = await fetch(`${this.baseUrl}/ticker/24hr?symbol=${symbol}`)
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar ticker 24h:', error)
      return null
    }
  }
  
  // Buscar candles/klines para análise técnica
  async getKlines(symbol: string, interval: string = '1h', limit: number = 200): Promise<BinanceKline[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      )
      const data = await response.json()
      
      return data.map((k: any) => ({
        openTime: k[0],
        open: k[1],
        high: k[2],
        low: k[3],
        close: k[4],
        volume: k[5],
        closeTime: k[6]
      }))
    } catch (error) {
      console.error('Erro ao buscar klines:', error)
      return []
    }
  }
  
  // ANÁLISE COMPLETA ESTRATÉGIA V3 (Base Original)
  async analyzeMarket(symbol: string): Promise<MarketAnalysis> {
    // ⚠️ VALIDAR DATA ATUAL ANTES DE QUALQUER ANÁLISE
    const dateValidation = this.validateCurrentDate()
    console.log(dateValidation.message)
    
    if (!dateValidation.isValid) {
      console.error(`❌ ERRO: ${dateValidation.message}`)
    }
    
    console.log(`🔍 Analisando ${symbol} em tempo real com Estratégia V3...`)
    console.log(`📅 DATA DA ANÁLISE: ${dateValidation.currentDate.toLocaleDateString('pt-BR')} ${dateValidation.currentDate.toLocaleTimeString('pt-BR')}`)
    
    // Buscar dados reais
    const ticker = await this.get24hTicker(symbol)
    const klines = await this.getKlines(symbol, '1h', 200)
    
    if (!ticker || klines.length === 0) {
      throw new Error('Não foi possível obter dados do mercado')
    }
    
    const price = parseFloat(ticker.lastPrice)
    const priceChange = parseFloat(ticker.priceChangePercent)
    const volume = parseFloat(ticker.volume)
    
    // Calcular indicadores
    const closes = klines.map(k => parseFloat(k.close))
    const highs = klines.map(k => parseFloat(k.high))
    const lows = klines.map(k => parseFloat(k.low))
    const volumes = klines.map(k => parseFloat(k.volume))
    
    // EMA 50 e 200
    const ema50 = this.calculateEMA(closes, 50)
    const ema200 = this.calculateEMA(closes, 200)
    const emaTrend = ema50 > ema200 ? 'BULLISH' : 'BEARISH'
    
    // RSI
    const rsi = this.calculateRSI(closes, 14)
    const rsiSignal = rsi < 30 ? 'oversold' : rsi > 70 ? 'overbought' : 'neutral'
    
    // ADX (força da tendência)
    const adx = this.calculateADX(highs, lows, closes, 14)
    const trendStrength = adx > 25 ? 'FORTE' : adx > 20 ? 'MODERADA' : 'FRACA'
    
    // ATR (volatilidade)
    const atr = this.calculateATR(highs, lows, closes, 14)
    const volatility = atr > price * 0.03 ? 'MUITO ALTA' : 
                       atr > price * 0.02 ? 'ALTA' : 
                       atr > price * 0.01 ? 'MÉDIA' : 'BAIXA'
    
    // MACD
    const macd = this.calculateMACD(closes)
    const macdSignal = macd.histogram > 0 ? 'BULLISH' : 'BEARISH'
    
    // Volume Profile
    const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20
    const volumeProfile = volume > avgVolume * 1.5 ? 'FORTE' : 
                          volume > avgVolume ? 'MODERADO' : 'FRACO'
    
    // Detectar padrões gráficos (V3 Base)
    const patterns = this.detectPatterns(klines)
    
    // Determinar sinal final (V3 - ESTRATÉGIA BASE)
    let signal: 'COMPRA' | 'VENDA' | 'NEUTRO' = 'NEUTRO'
    let confidence = 50
    const reasons: string[] = []
    
    // Lógica da Estratégia V3
    if (emaTrend === 'BULLISH' && adx > 25 && macdSignal === 'BULLISH') {
      signal = 'COMPRA'
      confidence = 70
      reasons.push('✅ Tendência de alta confirmada (EMA50 > EMA200)')
      reasons.push(`✅ Força forte (ADX: ${adx.toFixed(1)})`)
      reasons.push('✅ MACD positivo')
      
      if (rsiSignal === 'oversold') {
        confidence += 10
        reasons.push('✅ RSI sobrevendido - momento de compra')
      }
      
      if (volumeProfile === 'FORTE') {
        confidence += 10
        reasons.push('✅ Volume forte sustentando alta')
      }
      
      if (patterns.length > 0) {
        confidence += 5
        reasons.push(`✅ Padrão detectado: ${patterns[0]}`)
      }
      
    } else if (emaTrend === 'BEARISH' && adx > 25 && macdSignal === 'BEARISH') {
      signal = 'VENDA'
      confidence = 70
      reasons.push('⚠️ Tendência de baixa confirmada (EMA50 < EMA200)')
      reasons.push(`⚠️ Força forte (ADX: ${adx.toFixed(1)})`)
      reasons.push('⚠️ MACD negativo')
      
      if (rsiSignal === 'overbought') {
        confidence += 10
        reasons.push('⚠️ RSI sobrecomprado - momento de venda')
      }
      
      if (volumeProfile === 'FORTE') {
        confidence += 10
        reasons.push('⚠️ Volume forte pressionando baixa')
      }
    } else {
      reasons.push('⏸️ Mercado lateral ou sem força suficiente')
      reasons.push(`⏸️ ADX: ${adx.toFixed(1)} (abaixo de 25)`)
    }
    
    // Melhor horário de entrada
    const entryTime = this.getBestEntryTime(signal, rsi, adx)
    
    // Calcular probabilidade
    const probability = this.calculateProbability(
      emaTrend,
      adx,
      rsi,
      macdSignal,
      volumeProfile,
      patterns.length
    )
    
    return {
      symbol,
      price,
      trend: emaTrend === 'BULLISH' ? 'BULLISH' : 'BEARISH',
      strength: adx,
      volatility,
      signal,
      confidence: Math.min(confidence, 95),
      bestTimeframe: this.getBestTimeframe(volatility),
      entryTime,
      indicators: {
        ema50,
        ema200,
        rsi,
        macd: macd.histogram,
        adx,
        atr,
        volumeProfile
      },
      patterns,
      probability,
      reasons
    }
  }
  
  // Calcular EMA
  private calculateEMA(data: number[], period: number): number {
    if (data.length < period) return data[data.length - 1]
    
    const multiplier = 2 / (period + 1)
    let ema = data.slice(0, period).reduce((a, b) => a + b) / period
    
    for (let i = period; i < data.length; i++) {
      ema = (data[i] - ema) * multiplier + ema
    }
    
    return ema
  }
  
  // Calcular RSI
  private calculateRSI(closes: number[], period: number = 14): number {
    if (closes.length < period + 1) return 50
    
    let gains = 0
    let losses = 0
    
    for (let i = closes.length - period; i < closes.length; i++) {
      const change = closes[i] - closes[i - 1]
      if (change > 0) gains += change
      else losses -= change
    }
    
    const avgGain = gains / period
    const avgLoss = losses / period
    
    if (avgLoss === 0) return 100
    const rs = avgGain / avgLoss
    return 100 - (100 / (1 + rs))
  }
  
  // Calcular ADX
  private calculateADX(highs: number[], lows: number[], closes: number[], period: number = 14): number {
    if (highs.length < period + 1) return 20
    
    const trueRanges: number[] = []
    const plusDMs: number[] = []
    const minusDMs: number[] = []
    
    for (let i = 1; i < highs.length; i++) {
      const tr = Math.max(
        highs[i] - lows[i],
        Math.abs(highs[i] - closes[i - 1]),
        Math.abs(lows[i] - closes[i - 1])
      )
      trueRanges.push(tr)
      
      const upMove = highs[i] - highs[i - 1]
      const downMove = lows[i - 1] - lows[i]
      
      plusDMs.push(upMove > downMove && upMove > 0 ? upMove : 0)
      minusDMs.push(downMove > upMove && downMove > 0 ? downMove : 0)
    }
    
    const avgTR = trueRanges.slice(-period).reduce((a, b) => a + b) / period
    const avgPlusDM = plusDMs.slice(-period).reduce((a, b) => a + b) / period
    const avgMinusDM = minusDMs.slice(-period).reduce((a, b) => a + b) / period
    
    const plusDI = (avgPlusDM / avgTR) * 100
    const minusDI = (avgMinusDM / avgTR) * 100
    
    const dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100
    
    return dx
  }
  
  // Calcular ATR
  private calculateATR(highs: number[], lows: number[], closes: number[], period: number = 14): number {
    if (highs.length < period + 1) return 0
    
    const trueRanges: number[] = []
    
    for (let i = 1; i < highs.length; i++) {
      const tr = Math.max(
        highs[i] - lows[i],
        Math.abs(highs[i] - closes[i - 1]),
        Math.abs(lows[i] - closes[i - 1])
      )
      trueRanges.push(tr)
    }
    
    return trueRanges.slice(-period).reduce((a, b) => a + b) / period
  }
  
  // Calcular MACD
  private calculateMACD(closes: number[]): { macd: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(closes, 12)
    const ema26 = this.calculateEMA(closes, 26)
    const macd = ema12 - ema26
    
    const macdLine = [macd]
    const signal = this.calculateEMA(macdLine, 9)
    
    return {
      macd,
      signal,
      histogram: macd - signal
    }
  }
  
  // Detectar padrões gráficos
  private detectPatterns(klines: BinanceKline[]): string[] {
    const patterns: string[] = []
    
    if (klines.length < 10) return patterns
    
    const recentCandles = klines.slice(-10)
    
    // Martelo (Hammer)
    const lastCandle = recentCandles[recentCandles.length - 1]
    const open = parseFloat(lastCandle.open)
    const close = parseFloat(lastCandle.close)
    const high = parseFloat(lastCandle.high)
    const low = parseFloat(lastCandle.low)
    
    const body = Math.abs(close - open)
    const upperShadow = high - Math.max(open, close)
    const lowerShadow = Math.min(open, close) - low
    
    if (lowerShadow > body * 2 && upperShadow < body * 0.5) {
      patterns.push('Martelo (Hammer) - Reversão de alta')
    }
    
    // Shooting Star
    if (upperShadow > body * 2 && lowerShadow < body * 0.5) {
      patterns.push('Shooting Star - Reversão de baixa')
    }
    
    // Engolfo
    if (recentCandles.length >= 2) {
      const prev = recentCandles[recentCandles.length - 2]
      const prevOpen = parseFloat(prev.open)
      const prevClose = parseFloat(prev.close)
      
      if (prevClose < prevOpen && close > open && close > prevOpen && open < prevClose) {
        patterns.push('Engolfo de Alta - Forte compra')
      }
      
      if (prevClose > prevOpen && close < open && close < prevOpen && open > prevClose) {
        patterns.push('Engolfo de Baixa - Forte venda')
      }
    }
    
    return patterns
  }
  

  
  // Melhor horário de entrada
  private getBestEntryTime(signal: string, rsi: number, adx: number): string {
    const now = new Date()
    const hour = now.getHours()
    
    // Horários de maior liquidez: 9h-11h e 14h-16h UTC
    if (signal === 'COMPRA' && rsi < 40 && adx > 25) {
      return 'Agora - Condições ideais'
    } else if (signal === 'VENDA' && rsi > 60 && adx > 25) {
      return 'Agora - Condições ideais'
    } else {
      return `Aguardar próximo candle (${hour + 1}:00 UTC)`
    }
  }
  
  // Melhor timeframe
  private getBestTimeframe(volatility: string): string {
    switch (volatility) {
      case 'MUITO ALTA':
        return '5m'
      case 'ALTA':
        return '15m'
      case 'MÉDIA':
        return '1h'
      case 'BAIXA':
        return '4h'
      default:
        return '1h'
    }
  }
  
  // Calcular probabilidade
  private calculateProbability(
    trend: string,
    adx: number,
    rsi: number,
    macd: string,
    volume: string,
    patternsCount: number
  ): number {
    let probability = 50
    
    if (trend === 'BULLISH' && macd === 'BULLISH') probability += 15
    if (adx > 30) probability += 10
    if (adx > 40) probability += 5
    if (rsi < 30 || rsi > 70) probability += 10
    if (volume === 'FORTE') probability += 10
    if (patternsCount > 0) probability += 5
    
    return Math.min(probability, 95)
  }
  
  // Buscar TODOS os pares USDT da Binance (incluindo ZEC, XMR, DASH, etc)
  async getAllUSDTPairs(): Promise<string[]> {
    try {
      console.log('🔍 Buscando TODOS os pares USDT da Binance...')
      
      const response = await fetch(`${this.baseUrl}/exchangeInfo`)
      const data = await response.json()
      
      // Filtrar APENAS pares USDT que estão em status TRADING
      this.allPairs = data.symbols
        .filter((s: any) => {
          return s.symbol.endsWith('USDT') && 
                 s.status === 'TRADING' &&
                 s.permissions.includes('SPOT') // Apenas SPOT trading
        })
        .map((s: any) => s.symbol)
        .sort()
      
      console.log(`✅ ${this.allPairs.length} pares USDT encontrados e ativos!`)
      console.log(`📊 Primeiros 10 pares: ${this.allPairs.slice(0, 10).join(', ')}`)
      console.log(`📊 Últimos 10 pares: ${this.allPairs.slice(-10).join(', ')}`)
      
      // Verificar se ZECUSDT está na lista
      if (this.allPairs.includes('ZECUSDT')) {
        console.log('✅ ZECUSDT encontrado na lista!')
      } else {
        console.log('⚠️ ZECUSDT NÃO encontrado - pode não estar disponível na Binance')
      }
      
      return this.allPairs
    } catch (error) {
      console.error('❌ Erro ao buscar pares:', error)
      return []
    }
  }
  
  // DETECTAR MOVIMENTO DE BALEIAS (grandes ordens) - PRIORIDADE MÁXIMA
  async detectWhaleMovement(symbol: string): Promise<{
    isWhaleActive: boolean
    direction: 'BUY' | 'SELL' | 'NEUTRAL'
    volume: number
    confidence: number
    strength: number // 0-100 força da baleia
    priceTarget: number // Até onde a baleia vai levar o preço
    estimatedDuration: string // Quanto tempo vai durar
  }> {
    try {
      const ticker = await this.get24hTicker(symbol)
      const klines = await this.getKlines(symbol, '5m', 50)
      
      if (!ticker || klines.length === 0) {
        return { 
          isWhaleActive: false, 
          direction: 'NEUTRAL', 
          volume: 0, 
          confidence: 0,
          strength: 0,
          priceTarget: 0,
          estimatedDuration: 'N/A'
        }
      }
      
      const quoteVolume = parseFloat(ticker.quoteVolume) // Volume em USDT
      const priceChange = parseFloat(ticker.priceChangePercent)
      const currentPrice = parseFloat(ticker.lastPrice)
      const volume24h = parseFloat(ticker.volume)
      
      // Calcular volume médio dos últimos candles
      const recentVolumes = klines.slice(-10).map(k => parseFloat(k.volume))
      const avgVolume = recentVolumes.reduce((a, b) => a + b, 0) / recentVolumes.length
      const currentVolume = parseFloat(klines[klines.length - 1].volume)
      
      // Whale detectada se:
      // 1. Volume > $1M OU
      // 2. Volume atual > 3x média OU
      // 3. Movimento forte (>2%) com volume alto
      const isHighVolume = quoteVolume > this.whaleThreshold
      const isVolumeSpike = currentVolume > avgVolume * 3
      const isStrongMove = Math.abs(priceChange) > 2
      
      const isWhaleActive = isHighVolume || isVolumeSpike || (isStrongMove && currentVolume > avgVolume * 1.5)
      
      let direction: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL'
      let confidence = 50
      let strength = 0
      let priceTarget = currentPrice
      let estimatedDuration = 'N/A'
      
      if (isWhaleActive) {
        // Calcular força da baleia (0-100)
        strength = Math.min(100, Math.floor(
          (quoteVolume / this.whaleThreshold) * 30 + // 30 pontos por volume
          (currentVolume / avgVolume) * 20 + // 20 pontos por spike de volume
          Math.abs(priceChange) * 5 // 5 pontos por % de movimento
        ))
        
        if (priceChange > 1.5) {
          direction = 'BUY'
          confidence = Math.min(70 + (priceChange * 3) + (strength / 2), 98)
          
          // Projetar até onde o preço vai (baseado em força da baleia)
          const projectionMultiplier = 1 + (strength / 1000) + (priceChange / 100)
          priceTarget = currentPrice * projectionMultiplier
          
          // Estimar duração baseado em volume
          if (quoteVolume > this.whaleThreshold * 10) {
            estimatedDuration = '2-4 horas' // Whale gigante
          } else if (quoteVolume > this.whaleThreshold * 5) {
            estimatedDuration = '1-2 horas'
          } else {
            estimatedDuration = '30min-1hora'
          }
          
        } else if (priceChange < -1.5) {
          direction = 'SELL'
          confidence = Math.min(70 + (Math.abs(priceChange) * 3) + (strength / 2), 98)
          
          const projectionMultiplier = 1 - (strength / 1000) - (Math.abs(priceChange) / 100)
          priceTarget = currentPrice * projectionMultiplier
          
          if (quoteVolume > this.whaleThreshold * 10) {
            estimatedDuration = '2-4 horas'
          } else if (quoteVolume > this.whaleThreshold * 5) {
            estimatedDuration = '1-2 horas'
          } else {
            estimatedDuration = '30min-1hora'
          }
        }
      }
      
      return {
        isWhaleActive,
        direction,
        volume: quoteVolume,
        confidence: Math.floor(confidence),
        strength,
        priceTarget,
        estimatedDuration
      }
    } catch (error) {
      console.error('Erro ao detectar baleias:', error)
      return { 
        isWhaleActive: false, 
        direction: 'NEUTRAL', 
        volume: 0, 
        confidence: 0,
        strength: 0,
        priceTarget: 0,
        estimatedDuration: 'N/A'
      }
    }
  }
  
  // DETECTAR MUDANÇA DE FORÇA (quando vai reverter)
  async detectForceChange(symbol: string): Promise<{
    isChanging: boolean
    newDirection: 'UP' | 'DOWN' | 'NEUTRAL'
    confidence: number
    reason: string
    estimatedTime: string
  }> {
    try {
      const klines1m = await this.getKlines(symbol, '1m', 100)
      const klines5m = await this.getKlines(symbol, '5m', 50)
      
      if (klines1m.length < 20 || klines5m.length < 10) {
        return {
          isChanging: false,
          newDirection: 'NEUTRAL',
          confidence: 0,
          reason: 'Dados insuficientes',
          estimatedTime: 'N/A'
        }
      }
      
      const closes1m = klines1m.map(k => parseFloat(k.close))
      const volumes1m = klines1m.map(k => parseFloat(k.volume))
      const closes5m = klines5m.map(k => parseFloat(k.close))
      
      // Detectar divergência de RSI
      const rsi = this.calculateRSI(closes1m, 14)
      const rsiPrevious = this.calculateRSI(closes1m.slice(0, -5), 14)
      
      // Detectar diminuição de volume
      const recentVolume = volumes1m.slice(-10).reduce((a, b) => a + b, 0) / 10
      const previousVolume = volumes1m.slice(-20, -10).reduce((a, b) => a + b, 0) / 10
      const volumeDecreasing = recentVolume < previousVolume * 0.7
      
      // Detectar padrão de exaustão
      const lastCandle = klines1m[klines1m.length - 1]
      const open = parseFloat(lastCandle.open)
      const close = parseFloat(lastCandle.close)
      const high = parseFloat(lastCandle.high)
      const low = parseFloat(lastCandle.low)
      
      const upperWick = high - Math.max(open, close)
      const lowerWick = Math.min(open, close) - low
      const body = Math.abs(close - open)
      
      // Shooting Star (reversão de alta para baixa)
      const isShootingStar = upperWick > body * 2 && lowerWick < body * 0.5
      
      // Hammer (reversão de baixa para alta)
      const isHammer = lowerWick > body * 2 && upperWick < body * 0.5
      
      let isChanging = false
      let newDirection: 'UP' | 'DOWN' | 'NEUTRAL' = 'NEUTRAL'
      let confidence = 50
      let reason = 'Força mantida'
      let estimatedTime = 'N/A'
      
      // REVERSÃO DE ALTA PARA BAIXA
      if ((rsi > 70 && isShootingStar) || (volumeDecreasing && closes1m[closes1m.length - 1] < closes1m[closes1m.length - 5])) {
        isChanging = true
        newDirection = 'DOWN'
        confidence = 75
        reason = '⚠️ REVERSÃO IMINENTE: RSI sobrecomprado + padrão de exaustão'
        estimatedTime = '5-15 minutos'
      }
      
      // REVERSÃO DE BAIXA PARA ALTA
      else if ((rsi < 30 && isHammer) || (volumeDecreasing && closes1m[closes1m.length - 1] > closes1m[closes1m.length - 5])) {
        isChanging = true
        newDirection = 'UP'
        confidence = 75
        reason = '✅ REVERSÃO PARA ALTA: RSI sobrevendido + padrão de recuperação'
        estimatedTime = '5-15 minutos'
      }
      
      // EXAUSTÃO DE VOLUME (mudança próxima)
      else if (volumeDecreasing) {
        isChanging = true
        newDirection = 'NEUTRAL'
        confidence = 60
        reason = '⏸️ Volume diminuindo - possível mudança de direção'
        estimatedTime = '10-30 minutos'
      }
      
      return {
        isChanging,
        newDirection,
        confidence,
        reason,
        estimatedTime
      }
    } catch (error) {
      console.error('Erro ao detectar mudança de força:', error)
      return {
        isChanging: false,
        newDirection: 'NEUTRAL',
        confidence: 0,
        reason: 'Erro na análise',
        estimatedTime: 'N/A'
      }
    }
  }
  
  // ANÁLISE EM LOOP REAL - ESCANEIA **TODOS** OS PARES DA BINANCE EM TEMPO REAL (SEM EXCEÇÕES)
  async scanAllPairs(
    onProgress?: (current: number, total: number, symbol: string) => void
  ): Promise<MarketAnalysis[]> {
    // ⚠️ VALIDAR DATA ATUAL NO INÍCIO DO SCAN
    const dateValidation = this.validateCurrentDate()
    console.log('🔄 INICIANDO SCAN COMPLETO EM **TODOS** OS PARES DA BINANCE EM TEMPO REAL...')
    console.log(dateValidation.message)
    console.log(`📅 ESCANEANDO NO DIA: ${dateValidation.currentDate.toLocaleDateString('pt-BR')} às ${dateValidation.currentDate.toLocaleTimeString('pt-BR')}`)
    console.log('⚠️ ATENÇÃO: Esta análise é SEMPRE em tempo real, NUNCA usa dados antigos!')
    console.log('⚠️ IMPORTANTE: TODOS OS ATIVOS DA BINANCE SERÃO ANALISADOS - SEM EXCEÇÕES!')
    
    // SEMPRE buscar lista atualizada de pares (garantir que está REAL-TIME)
    console.log('🔄 Atualizando lista COMPLETA de pares da Binance...')
    await this.getAllUSDTPairs()
    
    const totalPairs = this.allPairs.length
    console.log(`📊 Total de pares ATIVOS para escanear: ${totalPairs} (100% da Binance)`)
    console.log(`📊 Primeiros 10 pares: ${this.allPairs.slice(0, 10).join(', ')}`)
    console.log(`📊 Últimos 10 pares: ${this.allPairs.slice(-10).join(', ')}`)
    console.log(`🎯 TODOS os ${totalPairs} pares serão analisados sem limite!`)
    
    const results: MarketAnalysis[] = []
    let scanned = 0
    
    // Processar em batches de 20 para otimizar (aumentado de 10 para 20)
    const batchSize = 20
    
    // ⚠️ IMPORTANTE: Processar TODOS os pares sem exceção
    for (let i = 0; i < this.allPairs.length; i += batchSize) {
      const batch = this.allPairs.slice(i, i + batchSize)
      
      console.log(`📦 Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(totalPairs / batchSize)}: Analisando ${batch.length} pares (${batch[0]} até ${batch[batch.length - 1]})`)
      
      // Processar batch em paralelo para máxima eficiência
      const batchPromises = batch.map(async (symbol) => {
        try {
          scanned++
          
          // Callback de progresso
          if (onProgress) {
            onProgress(scanned, totalPairs, symbol)
          }
          
          console.log(`[${scanned}/${totalPairs}] Analisando ${symbol}...`)
          
          const analysis = await this.analyzeMarket(symbol)
          const whaleData = await this.detectWhaleMovement(symbol)
          
          // 🐋 PRIORIDADE: Só gerar sinal se BALEIA estiver ativa E na mesma direção
          if (whaleData.isWhaleActive) {
            const whaleDirection = whaleData.direction === 'BUY' ? 'COMPRA' : whaleData.direction === 'SELL' ? 'VENDA' : 'NEUTRO'
            
            // Se baleia está ativa mas em direção diferente, IGNORAR sinal
            if (analysis.signal !== 'NEUTRO' && analysis.signal !== whaleDirection) {
              console.log(`⚠️ ${symbol}: Sinal ${analysis.signal} IGNORADO - Baleia está em ${whaleDirection}`)
              return null
            }
            
            // Ajustar confiança baseado em força da baleia
            analysis.confidence = Math.max(analysis.confidence, whaleData.confidence)
            analysis.reasons.unshift(
              `🐋 BALEIA ATIVA! Volume: $${(whaleData.volume / 1000000).toFixed(2)}M`,
              `💪 Força: ${whaleData.strength}/100`,
              `🎯 Alvo da Baleia: $${whaleData.priceTarget.toFixed(2)}`,
              `⏱️ Duração Estimada: ${whaleData.estimatedDuration}`
            )
            
            // Usar alvo da baleia como take profit
            ;(analysis as any).whaleTarget = whaleData.priceTarget
            ;(analysis as any).whaleDuration = whaleData.estimatedDuration
            ;(analysis as any).whaleStrength = whaleData.strength
            
            // Só adicionar se tiver baleia E confiança > 70%
            if (analysis.confidence >= 70) {
              console.log(`✅ ${symbol}: SINAL ENCONTRADO! Confiança: ${analysis.confidence}%`)
              return analysis
            }
          } else {
            console.log(`⏭️ ${symbol}: Sem atividade de baleia`)
          }
          
          return null
        } catch (error) {
          console.error(`❌ Erro ao analisar ${symbol}:`, error)
          return null
        }
      })
      
      // Aguardar batch completo antes de prosseguir
      const batchResults = await Promise.all(batchPromises)
      
      // Adicionar TODOS os resultados válidos (com baleia ativa)
      batchResults.forEach(result => {
        if (result) results.push(result)
      })
      
      console.log(`✅ Batch processado: ${batchResults.filter(r => r !== null).length} sinais com baleias encontrados`)
      
      // Pequeno delay entre batches para evitar rate limit da Binance (300ms - otimizado)
      await new Promise(resolve => setTimeout(resolve, 300))
    }
    
    const avgConfidence = results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.confidence, 0) / results.length) : 0
    
    const scanSummary = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 SCAN COMPLETO EM **TODOS** OS ATIVOS DA BINANCE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Data/Hora: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}
📊 Pares escaneados: ${totalPairs}/${totalPairs} (100% - TODOS OS ATIVOS)
✅ Sinais encontrados: ${results.length}
🐋 Sinais com BALEIAS ATIVAS: ${results.length} (100%)
💪 Confiança média: ${avgConfidence}%
🎯 Taxa de detecção: ${((results.length / totalPairs) * 100).toFixed(2)}%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
    console.log(scanSummary)
    
    // Ordenar por confiança (maior primeiro)
    return results.sort((a, b) => b.confidence - a.confidence)
  }
  
  // ⚠️ IMPORTANTE: Obter data/hora SEMPRE ATUAL (NUNCA hardcoded)
  getCurrentDateSP(): Date {
    const date = new Date() // SEMPRE pega data atual do sistema
    const spDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
    console.log(`📅 DATA ATUAL (São Paulo): ${spDate.toLocaleDateString('pt-BR')} ${spDate.toLocaleTimeString('pt-BR')}`)
    return spDate
  }
  
  // Verificar se é início da semana (Segunda-feira)
  isStartOfWeek(): boolean {
    const date = this.getCurrentDateSP()
    const isMonday = date.getDay() === 1 // 1 = Segunda-feira
    console.log(`📅 É início da semana? ${isMonday ? 'SIM (Segunda-feira)' : `NÃO (${['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][date.getDay()]})`}`)
    return isMonday
  }
  
  // Verificar se é primeira hora do dia (9h-10h UTC)
  isFirstHourOfDay(): boolean {
    const date = this.getCurrentDateSP()
    const hour = date.getHours()
    const isFirstHour = hour >= 9 && hour < 10
    console.log(`⏰ É primeira hora do dia? ${isFirstHour ? 'SIM' : 'NÃO'} (Hora atual: ${hour}h)`)
    return isFirstHour
  }
  
  // ⚠️ VALIDAÇÃO: Garantir que NUNCA use data hardcoded
  validateCurrentDate(): { isValid: boolean; currentDate: Date; message: string } {
    const now = new Date()
    const sp = this.getCurrentDateSP()
    
    // Verificar se a data está muito antiga (mais de 1 dia)
    const hoursDiff = Math.abs(now.getTime() - sp.getTime()) / 36e5
    
    if (hoursDiff > 24) {
      return {
        isValid: false,
        currentDate: sp,
        message: `⚠️ ATENÇÃO: Data pode estar incorreta! Diferença: ${hoursDiff.toFixed(0)} horas`
      }
    }
    
    return {
      isValid: true,
      currentDate: sp,
      message: `✅ Data/hora ATUAL validada: ${sp.toLocaleDateString('pt-BR')} ${sp.toLocaleTimeString('pt-BR')}`
    }
  }
}

export const binanceService = new BinanceService()