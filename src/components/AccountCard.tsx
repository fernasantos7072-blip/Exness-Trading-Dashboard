import React from 'react'
import { Button } from './ui/button'
import { TrendingUp, TrendingDown, MoreHorizontal, Activity, Zap } from 'lucide-react'

interface Account {
  id: string
  name: string
  type: string
  balance: number
  equity: number
  pnl: number
  pnlPercentage: number
  leverage: string
  server: string
  currency: string
  openTrades: number
}

interface AccountCardProps {
  account: Account
}

export const AccountCard = ({ account }: AccountCardProps) => {
  console.log('AccountCard rendered for account:', account.id)
  
  const isProfit = account.pnl >= 0
  const isActive = account.balance > 0
  
  return (
    <div className="trading-card group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            account.type === 'Pro' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
            account.type === 'Raw Spread' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
            'bg-gradient-to-br from-blue-500 to-blue-600'
          }`}>
            {account.type === 'Pro' ? <Zap className="w-5 h-5 text-white" /> :
             account.type === 'Raw Spread' ? <Activity className="w-5 h-5 text-white" /> :
             <TrendingUp className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h4 className="font-semibold text-white">{account.name}</h4>
            <p className="text-sm text-gray-400">#{account.id}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Balance</p>
            <p className="text-lg font-bold text-white">
              ${account.balance.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Equity</p>
            <p className="text-lg font-bold text-white">
              ${account.equity.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">P&L</p>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-semibold ${
                isProfit ? 'text-trading-success' : 'text-trading-danger'
              }`}>
                {isProfit ? '+' : ''}${account.pnl.toLocaleString()}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                isProfit ? 'bg-trading-success/20 text-trading-success' : 'bg-trading-danger/20 text-trading-danger'
              }`}>
                {isProfit ? '+' : ''}{account.pnlPercentage}%
              </span>
            </div>
          </div>
          {isProfit ? 
            <TrendingUp className="w-5 h-5 text-trading-success" /> : 
            <TrendingDown className="w-5 h-5 text-trading-danger" />
          }
        </div>
        
        <div className="pt-4 border-t border-trading-border/50">
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-gray-400 mb-1">Type</p>
              <p className="text-white font-medium">{account.type}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Leverage</p>
              <p className="text-white font-medium">{account.leverage}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Trades</p>
              <p className="text-white font-medium">{account.openTrades}</p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1" 
            disabled={!isActive}
            variant={isActive ? "default" : "secondary"}
          >
            {isActive ? 'Trade' : 'Deposit'}
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Manage
          </Button>
        </div>
      </div>
      
      {!isActive && (
        <div className="absolute inset-0 bg-trading-darker/80 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <p className="text-white font-medium mb-2">Account Inactive</p>
            <p className="text-sm text-gray-400">Make a deposit to start trading</p>
          </div>
        </div>
      )}
    </div>
  )
}