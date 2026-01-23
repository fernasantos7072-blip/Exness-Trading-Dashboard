import React from 'react'
import { Button } from './ui/button'
import { Bell, Settings, User, Zap } from 'lucide-react'

export const Header = () => {
  console.log('PRISMA IA Header rendered')
  
  return (
    <header className="border-b border-purple-500/30 bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  PRISMA IA
                </h1>
                <p className="text-xs text-purple-300">Advanced Trading System</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-sm">
                <span className="text-gray-400">Saldo: </span>
                <span className="text-green-400 font-bold">$10,847.32</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">P&L Hoje: </span>
                <span className="text-green-400 font-bold">+$234.56</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Meta: </span>
                <span className="text-purple-400 font-bold">$30/dia</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-purple-500/20 px-3 py-2 rounded-lg border border-purple-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-purple-300">Sistema Ativo</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-purple-500/20">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-purple-500/20">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-purple-500/20">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}