import React from 'react'
import { AccountCard } from './AccountCard'

export const AccountGrid = () => {
  console.log('AccountGrid component rendered')
  
  const accounts = [
    {
      id: '10001',
      name: 'Standard Account',
      type: 'Standard',
      balance: 45000.00,
      equity: 46875.25,
      pnl: 1875.25,
      pnlPercentage: 4.17,
      leverage: '1:500',
      server: 'ExnessEU-Real1',
      currency: 'USD',
      openTrades: 5
    },
    {
      id: '10002', 
      name: 'Pro Account',
      type: 'Pro',
      balance: 80847.32,
      equity: 82079.93,
      pnl: 1232.61,
      pnlPercentage: 1.52,
      leverage: '1:400',
      server: 'ExnessEU-Real2',
      currency: 'USD',
      openTrades: 7
    },
    {
      id: '10003',
      name: 'Scalping Account',
      type: 'Raw Spread',
      balance: 0.00,
      equity: 0.00,
      pnl: -1.00,
      pnlPercentage: 0.00,
      leverage: '1:2000',
      server: 'ExnessEU-Real3',
      currency: 'USD',
      openTrades: 0
    }
  ]
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Your Trading Accounts</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  )
}