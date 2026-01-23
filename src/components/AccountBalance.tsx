import React from 'react'
import { DollarSign, TrendingUp, Target, Activity } from 'lucide-react'

export const AccountBalance = () => {
  console.log('Account Balance component rendered')
  
  const accountData = {
    balance: 10847.32,
    equity: 10934.18,
    todayPnL: 234.56,
    weeklyPnL: 1245.89,
    monthlyPnL: 3456.78,
    openPositions: 2,
    dailyGoal: 30.00,
    goalProgress: 782 // percentagem
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <DollarSign className="w-8 h-8 text-purple-400" />
          <span className="text-xs text-gray-400">Saldo Total</span>
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          ${accountData.balance.toLocaleString()}
        </div>
        <div className="text-sm text-purple-400">
          Equity: ${accountData.equity.toLocaleString()}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <TrendingUp className="w-8 h-8 text-green-400" />
          <span className="text-xs text-gray-400">P&L Hoje</span>
        </div>
        <div className="text-3xl font-bold text-green-400 mb-1">
          +${accountData.todayPnL.toLocaleString()}
        </div>
        <div className="text-sm text-gray-300">
          Meta: ${accountData.dailyGoal} ({accountData.goalProgress}%)
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <Target className="w-8 h-8 text-blue-400" />
          <span className="text-xs text-gray-400">P&L Semana</span>
        </div>
        <div className="text-3xl font-bold text-blue-400 mb-1">
          +${accountData.weeklyPnL.toLocaleString()}
        </div>
        <div className="text-sm text-gray-300">
          P&L Mês: +${accountData.monthlyPnL.toLocaleString()}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <Activity className="w-8 h-8 text-yellow-400" />
          <span className="text-xs text-gray-400">Posições</span>
        </div>
        <div className="text-3xl font-bold text-yellow-400 mb-1">
          {accountData.openPositions}
        </div>
        <div className="text-sm text-gray-300">
          Abertas agora
        </div>
      </div>
    </div>
  )
}