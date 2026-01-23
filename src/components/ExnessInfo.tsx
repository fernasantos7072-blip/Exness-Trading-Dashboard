import React from 'react'
import { Shield, Award, Globe, Users, TrendingUp, Clock, Zap, CheckCircle } from 'lucide-react'

export const ExnessInfo = () => {
  console.log('ExnessInfo component rendered')
  
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: 'Regulamentação Multi-Jurisdicional',
      description: 'Regulada pela FCA (Reino Unido), CySEC (Chipre), FSCA (África do Sul) e FSC (Maurício)'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      title: 'Spreads Ultra Baixos',
      description: 'A partir de 0.0 pips em contas Raw Spread, com execução institucional'
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      title: 'Execução Ultra-Rápida',
      description: 'Execução média de ordens em 0.1ms, sem requotes'
    },
    {
      icon: <Globe className="w-6 h-6 text-purple-500" />,
      title: 'Mais de 120 Instrumentos',
      description: 'Forex, CFDs, Metais, Energias, Índices, Ações e Criptomoedas'
    },
    {
      icon: <Users className="w-6 h-6 text-orange-500" />,
      title: 'Suporte 24/7',
      description: 'Suporte multilíngue 24 horas por dia, 7 dias por semana'
    },
    {
      icon: <Clock className="w-6 h-6 text-pink-500" />,
      title: 'Saques Instantâneos',
      description: 'Saques processados instantaneamente, sem taxas ocultas'
    }
  ]
  
  const accountTypes = [
    {
      name: 'Standard',
      minDeposit: '$1',
      spread: 'A partir de 0.3 pips',
      leverage: 'Até 1:2000',
      commission: 'Sem comissão',
      features: ['Ideal para iniciantes', 'Sem taxas de depósito', 'Execução de mercado']
    },
    {
      name: 'Pro',
      minDeposit: '$200',
      spread: 'A partir de 0.1 pips',
      leverage: 'Até 1:2000',
      commission: 'Sem comissão',
      features: ['Para traders experientes', 'Spreads reduzidos', 'Execução instantânea']
    },
    {
      name: 'Raw Spread',
      minDeposit: '$200',
      spread: 'A partir de 0.0 pips',
      leverage: 'Até 1:2000',
      commission: '$3.50 por lote',
      features: ['Spreads mais baixos', 'Comissão transparente', 'ECN/STP execution']
    },
    {
      name: 'Zero',
      minDeposit: '$500',
      spread: '0 pips',
      leverage: 'Até 1:2000',
      commission: '$3.50 por lote',
      features: ['Spreads zero garantidos', 'Para scalping', 'Liquidez institucional']
    }
  ]
  
  const stats = [
    { label: 'Traders Ativos', value: '660,000+', icon: <Users className="w-5 h-5" /> },
    { label: 'Volume Mensal', value: '$2.2T+', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Países', value: '180+', icon: <Globe className="w-5 h-5" /> },
    { label: 'Anos no Mercado', value: '15+', icon: <Award className="w-5 h-5" /> }
  ]
  
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-2xl">E</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Exness</h2>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Uma das maiores corretoras do mundo, oferecendo condições de trading excepcionais 
          desde 2008. Líder global em Forex e CFDs com tecnologia de ponta.
        </p>
      </div>
      
      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="metric-card text-center">
            <div className="flex items-center justify-center text-primary mb-2">
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
      
      {/* Características Principais */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Por que escolher a Exness?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="trading-card">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Tipos de Conta */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Tipos de Conta</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {accountTypes.map((account, index) => (
            <div key={index} className="trading-card">
              <div className="text-center mb-4">
                <h4 className="text-lg font-bold text-white mb-2">{account.name}</h4>
                <div className="text-2xl font-bold text-primary mb-1">{account.minDeposit}</div>
                <div className="text-xs text-gray-400">Depósito Mínimo</div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400">Spread</p>
                  <p className="text-sm font-medium text-white">{account.spread}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Alavancagem</p>
                  <p className="text-sm font-medium text-white">{account.leverage}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Comissão</p>
                  <p className="text-sm font-medium text-white">{account.commission}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {account.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-trading-success flex-shrink-0" />
                    <span className="text-xs text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Aviso de Risco */}
      <div className="bg-gradient-to-r from-trading-danger/20 to-trading-warning/20 border border-trading-danger/30 rounded-lg p-4">
        <h4 className="font-semibold text-white mb-2 flex items-center">
          <Shield className="w-5 h-5 text-trading-danger mr-2" />
          Aviso de Risco
        </h4>
        <p className="text-sm text-gray-300">
          Trading de CFDs envolve risco significativo de perda de capital. 74-89% dos investidores 
          perdem dinheiro ao negociar CFDs. Certifique-se de entender os riscos envolvidos e 
          considere se pode perder o dinheiro investido.
        </p>
      </div>
    </div>
  )
}