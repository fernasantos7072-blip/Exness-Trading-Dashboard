import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'

export const AccountsOverview = () => {
  console.log('AccountsOverview component rendered')
  
  const totalBalance = 125847.32
  const totalEquity = 128954.18
  const totalPnL = 3106.86
  const pnlPercentage = 2.47
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Trading Accounts</h2>
        <div className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-400">Total Balance</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            ${totalBalance.toLocaleString()}
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-gray-400">Total Equity</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            ${totalEquity.toLocaleString()}
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-trading-success" />
              <span className="text-sm font-medium text-gray-400">Total P&L</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-trading-success">
            +${totalPnL.toLocaleString()}
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-trading-success" />
              <span className="text-sm font-medium text-gray-400">P&L %</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-trading-success">
            +{pnlPercentage}%
          </div>
        </div>
      </div>
    </div>
  )
}