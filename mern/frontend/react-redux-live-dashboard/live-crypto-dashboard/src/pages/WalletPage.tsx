/**
 * WalletPage Component
 * 
 * Dedicated page for wallet management.
 * Demonstrates navigation to a separate route.
 */

import WalletPanel from '../components/WalletPanel'

export default function WalletPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Wallet Management</h1>
        <p>Connect and manage your crypto wallet</p>
      </div>
      <WalletPanel />
    </div>
  )
}

