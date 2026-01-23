// Serviço REAL do Telegram para enviar sinais
interface TelegramMessage {
  pair: string
  direction: 'LONG' | 'SHORT'
  confidence: number
  entry: number
  sl: number
  tp: number
  timeframe: string
  entryTime: string
  reasons: string[]
}

class TelegramService {
  private botToken: string = ''
  private chatId: string = ''
  
  setBotToken(token: string) {
    this.botToken = token
    console.log('✅ Bot Token configurado')
  }
  
  setChatId(id: string) {
    this.chatId = id
    console.log('✅ Chat ID configurado')
  }
  
  // Enviar mensagem real para o Telegram
  async sendMessage(text: string): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      console.error('❌ Token ou Chat ID não configurado')
      return false
    }
    
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: text,
          parse_mode: 'HTML'
        })
      })
      
      const data = await response.json()
      
      if (data.ok) {
        console.log('✅ Mensagem enviada com sucesso para o Telegram')
        return true
      } else {
        console.error('❌ Erro ao enviar mensagem:', data.description)
        return false
      }
    } catch (error) {
      console.error('❌ Erro ao conectar com Telegram:', error)
      return false
    }
  }
  
  // Enviar sinal de trading formatado
  async sendTradingSignal(signal: TelegramMessage): Promise<boolean> {
    const message = `
🚨 <b>PRISMA IA - NOVO SINAL</b>

💰 <b>Par:</b> ${signal.pair}
📈 <b>Direção:</b> ${signal.direction}
⚡ <b>Confiança:</b> ${signal.confidence}%
📊 <b>Timeframe:</b> ${signal.timeframe}

🎯 <b>ENTRADA:</b> $${signal.entry.toFixed(2)}
🛑 <b>STOP LOSS:</b> $${signal.sl.toFixed(2)}
✅ <b>TAKE PROFIT:</b> $${signal.tp.toFixed(2)}

⏰ <b>Horário de Entrada:</b> ${signal.entryTime}

📋 <b>Razões da Análise:</b>
${signal.reasons.map(r => `• ${r}`).join('\n')}

⏰ ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
🤖 Gerado por PRISMA IA
    `.trim()
    
    return await this.sendMessage(message)
  }
  
  // Enviar mensagem de teste
  async sendTestMessage(): Promise<boolean> {
    const message = `
🤖 <b>PRISMA IA - Teste de Conexão</b>

✅ Sistema conectado com sucesso!
⏰ ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
🎯 Bot funcionando perfeitamente!
    `.trim()
    
    return await this.sendMessage(message)
  }
  
  // Verificar se bot está online
  async checkBot(): Promise<boolean> {
    if (!this.botToken) return false
    
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/getMe`
      const response = await fetch(url)
      const data = await response.json()
      
      return data.ok
    } catch (error) {
      console.error('❌ Erro ao verificar bot:', error)
      return false
    }
  }
}

export const telegramService = new TelegramService()