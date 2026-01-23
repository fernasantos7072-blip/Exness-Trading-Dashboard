import React from 'react'
import { BarChart3, PieChart, TrendingUp, Users } from 'lucide-react'

export const TradingMetrics = () => {
  console.log('TradingMetrics component rendered')
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="metric-card">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h3 className="font-semibold text-white">Active Trades</h3>
        </div>
        <div className="text-3xl font-bold text-white mb-2">12</div>
        <div className="text-sm text-gray-400">Across all accounts</div>
      </div>
      
      <div className="metric-card">
        <div className="flex items-center space-x-3 mb-4">
          <PieChart className="w-6 h-6 text-blue-400" />
          <h3 className="font-semibold text-white">Win Rate</h3>
        </div>
        <div className="text-3xl font-bold text-trading-success mb-2">73.5%</div>
        <div className="text-sm text-gray-400">Last 30 days</div>
      </div>
      
      <div className="metric-card">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-6 h-6 text-trading-success" />
          <h3 className="font-semibold text-white">Monthly Return</h3>
        </div>
        <div className="text-3xl font-bold text-trading-success mb-2">+8.2%</div>
        <div className="text-sm text-gray-400">This month</div>
      </div>
      
      <div className="metric-card">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-6 h-6 text-purple-400" />
          <h3 className="font-semibold text-white">Account Types</h3>
        </div>
        <div className="text-3xl font-bold text-white mb-2">4</div>
        <div className="text-sm text-gray-400">Standard & Pro</div>
      </div>
    </div>
  )
}