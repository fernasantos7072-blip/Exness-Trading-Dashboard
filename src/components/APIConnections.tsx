import React, { useState } from 'react'
import { Zap, Activity, Send, CheckCircle, AlertCircle, Settings } from 'lucide-react'
import { Button } from './ui/button'

export const APIConnections = () => {
  console.log('API Connections component rendered')
  
  const [connections, setConnections] = useState({
    gpt: { status: 'connected', key: 'sk-proj-...', name: 'ChatGPT API' },
    binance: { status: 'connected', key: 'binance-...', name: 'Binance API' },
    telegram: { status: 'connected', key: '7441813085:AAFx...', name: 'Telegram Bot' }
  })
  
  const [cloudMode, setCloudMode] = useState(true)
  const [autoConfirm, setAutoConfirm] = useState(20) // minutos
  
  const getStatusColor = (status: string) => {
    return status === 'connected' ? 'text-green-400' : 'text-red-400'
  }
  
  const getStatusIcon = (status: string) => {
    return status === 'connected' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Conexões de API</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">Todas conectadas</span>
        </div>
      </div>
      
      {/* Status das APIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(connections).map(([key, conn]) => (
          <div key={key} className="bg-black/40 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {key === 'gpt' && <Zap className="w-6 h-6 text-purple-400" />}
                {key === 'binance' && <Activity className="w-6 h-6 text-yellow-400" />}
                {key === 'telegram' && <Send className="w-6 h-6 text-blue-400" />}
                <h3 className="font-semibold text-white">{conn.name}</h3>
              </div>
              <div className={getStatusColor(conn.status)}>
                {getStatusIcon(conn.status)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-400">API Key</p>
                <input
                  type="password"
                  value={conn.key}
                  readOnly
                  className="w-full bg-purple-500/10 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm mt-1"
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Status</span>
                <span className={getStatusColor(conn.status)}>
                  {conn.status === 'connected' ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
            
            <Button size="sm" variant="outline" className="w-full mt-4">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </div>
        ))}
      </div>
      
      {/* Configurações de Nuvem */}
      <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-purple-400" />
          Modo Nuvem - Análise Contínua
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Executar em Nuvem</p>
                <p className="text-sm text-gray-400">Continua rodando mesmo quando você sai</p>
              </div>
              <input
                type="checkbox"
                checked={cloudMode}
                onChange={(e) => setCloudMode(e.target.checked)}
                className="w-5 h-5 text-purple-500 rounded focus:ring-purple-500/50"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-white font-medium">Confirmação Automática</label>
              <select
                value={autoConfirm}
                onChange={(e) => setAutoConfirm(Number(e.target.value))}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-3 py-2 text-white"
              >
                <option value={10}>A cada 10 minutos</option>
                <option value={20}>A cada 20 minutos</option>
                <option value={30}>A cada 30 minutos</option>
                <option value={60}>A cada 1 hora</option>
              </select>
              <p className="text-xs text-gray-400">
                PRISMA IA enviará mensagem no Telegram perguntando se quer continuar
              </p>
            </div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Como Funciona:</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Robô continua analisando mercado 24/7</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Envia sinais automaticamente no Telegram</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Pergunta a cada {autoConfirm} minutos se continua</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Você responde "continuar" ou "parar"</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Status do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-black/40 border border-green-500/30 rounded-lg p-4 text-center">
          <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">40+</div>
          <div className="text-sm text-gray-400">Pares Analisando</div>
        </div>
        <div className="bg-black/40 border border-blue-500/30 rounded-lg p-4 text-center">
          <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">15s</div>
          <div className="text-sm text-gray-400">Intervalo de Scan</div>
        </div>
        <div className="bg-black/40 border border-purple-500/30 rounded-lg p-4 text-center">
          <Send className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">24/7</div>
          <div className="text-sm text-gray-400">Modo Nuvem Ativo</div>
        </div>
        <div className="bg-black/40 border border-yellow-500/30 rounded-lg p-4 text-center">
          <CheckCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{autoConfirm}min</div>
          <div className="text-sm text-gray-400">Próxima Confirmação</div>
        </div>
      </div>
    </div>
  )
}