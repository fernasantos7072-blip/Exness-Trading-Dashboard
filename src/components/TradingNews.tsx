import React, { useState, useEffect } from 'react'
import { Newspaper, TrendingUp, TrendingDown, Clock, ExternalLink } from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  summary: string
  impact: 'High' | 'Medium' | 'Low'
  sentiment: 'Bullish' | 'Bearish' | 'Neutral'
  currency: string[]
  time: string
  source: string
  recommendation: string
}

export const TradingNews = () => {
  console.log('TradingNews component rendered')
  
  const [news] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Fed Mantém Taxa em 5.25-5.50%, Sinaliza Possível Corte em 2024',
      summary: 'Federal Reserve mantém taxa de juros inalterada, mas Jerome Powell indica possibilidade de cortes se inflação continuar caindo.',
      impact: 'High',
      sentiment: 'Bearish',
      currency: ['USD'],
      time: '2 horas atrás',
      source: 'Reuters',
      recommendation: 'VENDER USD - Fed dovish pode enfraquecer dólar'
    },
    {
      id: '2',
      title: 'BCE Eleva Taxa para 4.50%, Lagarde Fala em Mais Aumentos',
      summary: 'Banco Central Europeu aumenta taxa em 0.25% e Christine Lagarde sugere que mais aumentos podem ser necessários para controlar inflação.',
      impact: 'High',
      sentiment: 'Bullish',
      currency: ['EUR'],
      time: '4 horas atrás',
      source: 'Bloomberg',
      recommendation: 'COMPRAR EUR - BCE hawkish fortalece euro'
    },
    {
      id: '3',
      title: 'Bitcoin Rompe $43,000 com Aprovação de ETF Spot',
      summary: 'Bitcoin sobe 5% após rumores de aprovação de ETF spot pela SEC. Volume de negociação aumenta significativamente.',
      impact: 'Medium',
      sentiment: 'Bullish',
      currency: ['BTC'],
      time: '1 hora atrás',
      source: 'CoinDesk',
      recommendation: 'COMPRAR BTC - Momentum altista forte'
    },
    {
      id: '4',
      title: 'Ouro Atinge Máxima de 6 Meses em $2,040',
      summary: 'Preço do ouro sobe com incertezas geopolíticas e expectativa de corte de juros do Fed.',
      impact: 'Medium',
      sentiment: 'Bullish',
      currency: ['XAU'],
      time: '3 horas atrás',
      source: 'MarketWatch',
      recommendation: 'COMPRAR OURO - Safe haven em alta'
    },
    {
      id: '5',
      title: 'Libra Cai após Dados Fracos de Inflação do Reino Unido',
      summary: 'GBP perde força após CPI vir abaixo do esperado, reduzindo chances de alta de juros do BoE.',
      impact: 'High',
      sentiment: 'Bearish',
      currency: ['GBP'],
      time: '5 horas atrás',
      source: 'Financial Times',
      recommendation: 'VENDER GBP - Dados fracos pressionam libra'
    },
    {
      id: '6',
      title: 'Petróleo WTI Sobe 3% com Tensões no Oriente Médio',
      summary: 'Preços do petróleo disparam com escalada de tensões geopolíticas e corte de produção da OPEC+.',
      impact: 'Medium',
      sentiment: 'Bullish',
      currency: ['OIL'],
      time: '6 horas atrás',
      source: 'Energy Today',
      recommendation: 'COMPRAR PETRÓLEO - Fundamentals altistas'
    }
  ])
  
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish': return 'text-trading-success'
      case 'Bearish': return 'text-trading-danger'
      case 'Neutral': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }
  
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish': return <TrendingUp className="w-4 h-4" />
      case 'Bearish': return <TrendingDown className="w-4 h-4" />
      case 'Neutral': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }
  
  const getImpactBadge = (impact: string) => {
    const colors = {
      High: 'bg-trading-danger/20 text-trading-danger border-trading-danger/30',
      Medium: 'bg-trading-warning/20 text-trading-warning border-trading-warning/30',
      Low: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
    return colors[impact as keyof typeof colors] || colors.Low
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Newspaper className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold text-white">Notícias de Trading</h3>
        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
          Ao Vivo
        </span>
      </div>
      
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-4">
        <h4 className="font-semibold text-white mb-2">🎯 Estratégia de Notícias</h4>
        <p className="text-sm text-gray-300">
          <span className="text-primary font-semibold">Sempre opere A FAVOR das notícias!</span> 
          {' '}Use nossos sinais para posicionar-se antes e depois dos eventos econômicos.
        </p>
      </div>
      
      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="trading-card hover:border-primary/30 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getImpactBadge(item.impact)}`}>
                  {item.impact} Impact
                </span>
                {item.currency.map(curr => (
                  <span key={curr} className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-semibold">
                    {curr}
                  </span>
                ))}
              </div>
              
              <div className={`flex items-center space-x-1 ${getSentimentColor(item.sentiment)}`}>
                {getSentimentIcon(item.sentiment)}
                <span className="text-sm font-medium">{item.sentiment}</span>
              </div>
            </div>
            
            <h4 className="font-semibold text-white mb-2 text-lg leading-tight">
              {item.title}
            </h4>
            
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {item.summary}
            </p>
            
            <div className="bg-trading-darker/50 rounded-lg p-3 mb-3">
              <div className="flex items-start space-x-2">
                <TrendingUp className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Recomendação de Trading</p>
                  <p className="text-sm text-white font-medium">{item.recommendation}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3" />
                <span>{item.time}</span>
                <span>•</span>
                <span>{item.source}</span>
              </div>
              <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                <span>Ler mais</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-xs text-gray-400 mb-2">
          Última atualização: {new Date().toLocaleTimeString('pt-BR')}
        </p>
        <p className="text-xs text-gray-500">
          As recomendações são baseadas em análise técnica e fundamental. 
          Sempre faça sua própria análise antes de investir.
        </p>
      </div>
    </div>
  )
}