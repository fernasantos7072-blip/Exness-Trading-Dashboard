import React, { useState, useEffect } from 'react'
import { Calendar, Clock } from 'lucide-react'

export const CurrentDateDisplay = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  useEffect(() => {
    // Atualizar a cada segundo para garantir que sempre mostre TEMPO REAL
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Sao_Paulo'
    })
  }
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Sao_Paulo'
    })
  }
  
  return (
    <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <div className="text-xs text-green-400 font-medium mb-1">📅 DATA ATUAL (São Paulo)</div>
            <div className="text-lg font-bold text-white">{formatDate(currentDate)}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <div className="text-xs text-green-400 font-medium mb-1">⏰ HORA ATUAL</div>
            <div className="text-3xl font-bold text-green-400 font-mono">{formatTime(currentDate)}</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-green-500/20">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">✅ Sistema em TEMPO REAL</span>
          </div>
          <span className="text-gray-400">
            Todas as análises são feitas com dados ATUAIS, NUNCA dados antigos
          </span>
        </div>
      </div>
    </div>
  )
}
