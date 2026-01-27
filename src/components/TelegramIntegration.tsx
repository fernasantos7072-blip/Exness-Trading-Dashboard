import React, { useState, useEffect } from 'react'
import { Send, MessageCircle, Settings, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import { telegramService } from '../lib/telegramService'

export const TelegramIntegration = () => {
  console.log('Telegram Integration component rendered')
  
  const [botToken, setBotToken] = useState('7441813085:AAFx5z_0iwEnjcmLU6PaTltg4KDLQLZxeUo')
  const [chatId, setChatId] = useState('7120558064')
  const [isConnected, setIsConnected] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testMessage, setTestMessage] = useState('')
  const [signalHistory, setSignalHistory] = useState<any[]>([])
  const [autoSend, setAutoSend] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')
  
  // Configurar Telegram ao carregar
  useEffect(() => {
    if (botToken && chatId) {
      telegramService.setBotToken(botToken)
      telegramService.setChatId(chatId)
      checkConnection()
    }
  }, [botToken, chatId])
  
  const checkConnection = async () => {
    const isOnline = await telegramService.checkBot()
    setIsConnected(isOnline)
    
    if (isOnline) {
      setStatusMessage('✅ Bot conectado e online')
    } else {
      setStatusMessage('❌ Erro ao conectar com o bot')
    }
  }
  
  const sendTestMessage = async () => {
    if (!botToken || !chatId) {
      setStatusMessage('❌ Configure Token e Chat ID primeiro')
      return
    }
    
    setIsTesting(true)
    setStatusMessage('📤 Enviando mensagem de teste...')
    
    const success = await telegramService.sendTestMessage()
    
    if (success) {
      setStatusMessage('✅ Mensagem enviada! Verifique seu Telegram')
      
      const newMessage = {
        id: Date.now(),
        content: 'Mensagem de teste enviada com sucesso',
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        type: 'test',
        status: 'sent'
      }
      
      setSignalHistory(prev => [newMessage, ...prev.slice(0, 9)])
    } else {
      setStatusMessage('❌ Falha ao enviar. Verifique Token e Chat ID')
    }
    
    setIsTesting(false)
  }
  
  const sendCustomMessage = async () => {
    if (!testMessage.trim()) {
      setStatusMessage('❌ Digite uma mensagem primeiro')
      return
    }
    
    setIsTesting(true)
    setStatusMessage('📤 Enviando...')
    
    const success = await telegramService.sendMessage(testMessage)
    
    if (success) {
      setStatusMessage('✅ Mensagem enviada!')
      setTestMessage('')
      
      const newMessage = {
        id: Date.now(),
        content: testMessage,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        type: 'custom',
        status: 'sent'
      }
      
      setSignalHistory(prev => [newMessage, ...prev.slice(0, 9)])
    } else {
      setStatusMessage('❌ Falha ao enviar')
    }
    
    setIsTesting(false)
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Send className="w-6 h-6 mr-2 text-purple-400" />
          Integração Telegram
        </h2>
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
          isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
          <span className="text-sm font-medium">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
      </div>
      
      {/* Status Message */}
      {statusMessage && (
        <div className={`p-4 rounded-lg border ${
          statusMessage.includes('✅') ? 'bg-green-500/10 border-green-500/30 text-green-400' :
          statusMessage.includes('❌') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
          'bg-blue-500/10 border-blue-500/30 text-blue-400'
        }`}>
          {statusMessage}
        </div>
      )}
      
      {/* Configuração */}
      <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-purple-400" />
          Configuração do Bot
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Bot Token</label>
            <input
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="Cole seu Bot Token aqui"
              className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <p className="text-xs text-purple-400 mt-1">💡 Obtenha em @BotFather no Telegram</p>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">Chat ID</label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="Seu Chat ID"
              className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <p className="text-xs text-purple-400 mt-1">💡 Digite /start no bot para obter seu ID</p>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="autoSend"
              checked={autoSend}
              onChange={(e) => setAutoSend(e.target.checked)}
              className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500/50"
            />
            <label htmlFor="autoSend" className="text-white">
              Envio automático de sinais
            </label>
          </div>
          <button
            onClick={checkConnection}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all"
          >
            Verificar Conexão
          </button>
        </div>
      </div>
      
      {/* Teste de Mensagem */}
      <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-purple-400" />
          Teste de Mensagem
        </h3>
        
        <div className="space-y-4">
          <textarea
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Digite uma mensagem personalizada (opcional)..."
            className="w-full h-24 bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
          />
          
          <div className="flex space-x-4">
            <button
              onClick={sendTestMessage}
              disabled={!isConnected || isTesting}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>{isTesting ? 'Enviando...' : 'Enviar Teste Padrão'}</span>
            </button>
            
            <button
              onClick={sendCustomMessage}
              disabled={!isConnected || isTesting || !testMessage.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isTesting ? 'Enviando...' : 'Enviar Personalizada'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Formato dos Sinais */}
      <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Formato dos Sinais Automáticos
        </h3>
        
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <pre className="text-sm text-white whitespace-pre-wrap">
{`🚨 PRISMA IA - NOVO SINAL

💰 Par: BTCUSDT
📈 Direção: LONG
⚡ Confiança: 87%
📊 Timeframe: 5m

🎯 ENTRADA: $43250.50
🛑 STOP LOSS: $43149.50
✅ TAKE PROFIT: $43451.50

⏰ Horário de Entrada: Agora - Condições ideais

📋 Razões da Análise:
• Tendência de alta confirmada
• Força forte (ADX: 28.5)
• RSI em zona ideal
• Volume sustentando movimento

⏰ ${new Date().toLocaleString('pt-BR')}
🤖 Gerado por PRISMA IA`}
          </pre>
        </div>
      </div>
      
      {/* Histórico de Mensagens */}
      <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Histórico de Mensagens</h3>
        
        {signalHistory.length === 0 ? (
          <div className="text-center py-8 bg-gradient-to-b from-gray-900/30 to-black/30 rounded-lg">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Nenhuma mensagem enviada ainda</p>
            <p className="text-sm text-gray-500 mt-2">Clique em "Enviar Teste" para começar</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto bg-black/20 p-4 rounded-lg">
            {signalHistory.map((message) => (
              <div key={message.id} className="border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      message.type === 'signal' 
                        ? 'bg-green-500/20 text-green-400' 
                        : message.type === 'test'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {message.type === 'signal' ? 'SINAL' : message.type === 'test' ? 'TESTE' : 'CUSTOM'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-300">{message.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}