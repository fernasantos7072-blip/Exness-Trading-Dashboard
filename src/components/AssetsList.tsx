import React, { useState } from 'react'
import { Button } from './ui/button'
import { TrendingUp, TrendingDown, Search, Filter } from 'lucide-react'

interface Asset {
  symbol: string
  name: string
  category: string
  price: number
  change: number
  changePercent: number
  spread: number
  leverage: string
}

export const AssetsList = () => {
  console.log('AssetsList component rendered')
  
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  
  const assets: Asset[] = [
    // Major Forex Pairs
    { symbol: 'EURUSD', name: 'Euro vs US Dollar', category: 'Forex Major', price: 1.0925, change: 0.0012, changePercent: 0.11, spread: 0.1, leverage: '1:2000' },
    { symbol: 'GBPUSD', name: 'British Pound vs US Dollar', category: 'Forex Major', price: 1.2734, change: -0.0023, changePercent: -0.18, spread: 0.2, leverage: '1:2000' },
    { symbol: 'USDJPY', name: 'US Dollar vs Japanese Yen', category: 'Forex Major', price: 149.85, change: 0.45, changePercent: 0.30, spread: 0.1, leverage: '1:2000' },
    { symbol: 'USDCHF', name: 'US Dollar vs Swiss Franc', category: 'Forex Major', price: 0.8912, change: 0.0008, changePercent: 0.09, spread: 0.2, leverage: '1:2000' },
    { symbol: 'AUDUSD', name: 'Australian Dollar vs US Dollar', category: 'Forex Major', price: 0.6645, change: -0.0015, changePercent: -0.23, spread: 0.1, leverage: '1:2000' },
    { symbol: 'USDCAD', name: 'US Dollar vs Canadian Dollar', category: 'Forex Major', price: 1.3765, change: 0.0018, changePercent: 0.13, spread: 0.2, leverage: '1:2000' },
    { symbol: 'NZDUSD', name: 'New Zealand Dollar vs US Dollar', category: 'Forex Major', price: 0.5987, change: -0.0012, changePercent: -0.20, spread: 0.3, leverage: '1:2000' },
    
    // Minor Forex Pairs
    { symbol: 'EURGBP', name: 'Euro vs British Pound', category: 'Forex Minor', price: 0.8578, change: 0.0034, changePercent: 0.40, spread: 0.3, leverage: '1:2000' },
    { symbol: 'EURJPY', name: 'Euro vs Japanese Yen', category: 'Forex Minor', price: 163.72, change: 0.67, changePercent: 0.41, spread: 0.2, leverage: '1:2000' },
    { symbol: 'GBPJPY', name: 'British Pound vs Japanese Yen', category: 'Forex Minor', price: 190.84, change: -0.45, changePercent: -0.24, spread: 0.4, leverage: '1:2000' },
    { symbol: 'AUDCAD', name: 'Australian Dollar vs Canadian Dollar', category: 'Forex Minor', price: 0.9145, change: 0.0023, changePercent: 0.25, spread: 0.5, leverage: '1:2000' },
    { symbol: 'AUDCHF', name: 'Australian Dollar vs Swiss Franc', category: 'Forex Minor', price: 0.5921, change: -0.0018, changePercent: -0.30, spread: 0.4, leverage: '1:2000' },
    
    // Exotic Pairs
    { symbol: 'USDTRY', name: 'US Dollar vs Turkish Lira', category: 'Forex Exotic', price: 28.45, change: 0.15, changePercent: 0.53, spread: 15, leverage: '1:100' },
    { symbol: 'USDZAR', name: 'US Dollar vs South African Rand', category: 'Forex Exotic', price: 18.67, change: -0.23, changePercent: -1.22, spread: 50, leverage: '1:100' },
    { symbol: 'USDMXN', name: 'US Dollar vs Mexican Peso', category: 'Forex Exotic', price: 17.23, change: 0.08, changePercent: 0.47, spread: 30, leverage: '1:100' },
    
    // Cryptocurrencies
    { symbol: 'BTCUSD', name: 'Bitcoin vs US Dollar', category: 'Crypto', price: 42587.50, change: 1245.30, changePercent: 3.01, spread: 25, leverage: '1:2' },
    { symbol: 'ETHUSD', name: 'Ethereum vs US Dollar', category: 'Crypto', price: 2634.75, change: -67.45, changePercent: -2.50, spread: 2.5, leverage: '1:2' },
    { symbol: 'ADAUSD', name: 'Cardano vs US Dollar', category: 'Crypto', price: 0.4523, change: 0.0234, changePercent: 5.46, spread: 0.003, leverage: '1:2' },
    { symbol: 'DOTUSD', name: 'Polkadot vs US Dollar', category: 'Crypto', price: 6.78, change: -0.45, changePercent: -6.22, spread: 0.05, leverage: '1:2' },
    { symbol: 'XRPUSD', name: 'Ripple vs US Dollar', category: 'Crypto', price: 0.5634, change: 0.0123, changePercent: 2.23, spread: 0.002, leverage: '1:2' },
    
    // Commodities
    { symbol: 'XAUUSD', name: 'Gold vs US Dollar', category: 'Metals', price: 2034.50, change: 12.75, changePercent: 0.63, spread: 0.35, leverage: '1:2000' },
    { symbol: 'XAGUSD', name: 'Silver vs US Dollar', category: 'Metals', price: 24.67, change: -0.23, changePercent: -0.92, spread: 0.03, leverage: '1:2000' },
    { symbol: 'XPTUSD', name: 'Platinum vs US Dollar', category: 'Metals', price: 945.20, change: 8.45, changePercent: 0.90, spread: 3.5, leverage: '1:200' },
    { symbol: 'XPDUSD', name: 'Palladium vs US Dollar', category: 'Metals', price: 1123.40, change: -15.67, changePercent: -1.38, spread: 8, leverage: '1:200' },
    { symbol: 'USOIL', name: 'US Crude Oil', category: 'Energy', price: 78.45, change: 1.23, changePercent: 1.59, spread: 0.03, leverage: '1:200' },
    { symbol: 'UKOIL', name: 'UK Brent Oil', category: 'Energy', price: 82.67, change: 0.89, changePercent: 1.09, spread: 0.04, leverage: '1:200' },
    { symbol: 'NGAS', name: 'Natural Gas', category: 'Energy', price: 2.456, change: -0.067, changePercent: -2.66, spread: 0.003, leverage: '1:200' },
    
    // Stock Indices
    { symbol: 'US30', name: 'Dow Jones Industrial Average', category: 'Indices', price: 34567.89, change: 234.56, changePercent: 0.68, spread: 2.5, leverage: '1:200' },
    { symbol: 'US500', name: 'S&P 500 Index', category: 'Indices', price: 4456.78, change: -23.45, changePercent: -0.52, spread: 0.4, leverage: '1:200' },
    { symbol: 'US100', name: 'NASDAQ 100 Index', category: 'Indices', price: 15234.67, change: 145.23, changePercent: 0.96, spread: 1.2, leverage: '1:200' },
    { symbol: 'GER30', name: 'DAX 30 Index', category: 'Indices', price: 15678.90, change: -89.34, changePercent: -0.57, spread: 1.5, leverage: '1:200' },
    { symbol: 'UK100', name: 'FTSE 100 Index', category: 'Indices', price: 7456.78, change: 34.56, changePercent: 0.47, spread: 1.8, leverage: '1:200' },
    { symbol: 'JPN225', name: 'Nikkei 225 Index', category: 'Indices', price: 32456.78, change: 189.45, changePercent: 0.59, spread: 8, leverage: '1:200' },
    { symbol: 'FRA40', name: 'CAC 40 Index', category: 'Indices', price: 7234.56, change: -45.67, changePercent: -0.63, spread: 2, leverage: '1:200' },
    
    // Individual Stocks
    { symbol: 'AAPL', name: 'Apple Inc.', category: 'Stocks', price: 178.45, change: 2.34, changePercent: 1.33, spread: 0.01, leverage: '1:20' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', category: 'Stocks', price: 142.67, change: -1.23, changePercent: -0.85, spread: 0.02, leverage: '1:20' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', category: 'Stocks', price: 378.90, change: 4.56, changePercent: 1.22, spread: 0.01, leverage: '1:20' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', category: 'Stocks', price: 145.23, change: -2.67, changePercent: -1.81, spread: 0.02, leverage: '1:20' },
    { symbol: 'TSLA', name: 'Tesla Inc.', category: 'Stocks', price: 234.56, change: 8.90, changePercent: 3.95, spread: 0.03, leverage: '1:5' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', category: 'Stocks', price: 456.78, change: 12.34, changePercent: 2.78, spread: 0.05, leverage: '1:10' }
  ]
  
  const categories = ['All', 'Forex Major', 'Forex Minor', 'Forex Exotic', 'Crypto', 'Metals', 'Energy', 'Indices', 'Stocks']
  
  const filteredAssets = assets.filter(asset => {
    const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h3 className="text-xl font-semibold text-white">Trading Instruments ({assets.length}+)</h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-trading-card border border-trading-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-trading-card border border-trading-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => (
          <div key={asset.symbol} className="trading-card hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-white text-lg">{asset.symbol}</h4>
                <p className="text-sm text-gray-400">{asset.name}</p>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full mt-1 inline-block">
                  {asset.category}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-white">${asset.price.toLocaleString()}</p>
                <div className="flex items-center space-x-1">
                  {asset.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-trading-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-trading-danger" />
                  )}
                  <span className={`text-sm font-medium ${
                    asset.change >= 0 ? 'text-trading-success' : 'text-trading-danger'
                  }`}>
                    {asset.change >= 0 ? '+' : ''}{asset.changePercent}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-400 mb-1">Spread</p>
                <p className="text-white font-medium">{asset.spread}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Leverage</p>
                <p className="text-white font-medium">{asset.leverage}</p>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button size="sm" className="flex-1" variant="default">
                Buy
              </Button>
              <Button size="sm" className="flex-1" variant="outline">
                Sell
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No assets found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}