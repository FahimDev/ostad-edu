/**
 * Dashboard Component
 * 
 * Main layout component that brings together WalletPanel and OrdersTable.
 * 
 * This component demonstrates:
 * - Component composition (combining smaller components)
 * - Layout structure
 * - Container for the entire dashboard UI
 * - Live updates using custom hook
 */

import WalletPanel from './WalletPanel'
import OrdersTable from './OrdersTable'
import { useLiveStatusUpdates } from '../hooks/useLiveStatusUpdates'

/**
 * Dashboard - Main dashboard layout
 * 
 * Structure:
 * - Header with title
 * - WalletPanel (left/top section)
 * - OrdersTable (main content area)
 * 
 * Live Updates:
 * - Uses useLiveStatusUpdates hook to simulate real-time status changes
 * - Updates orders from Pending → Processing → Completed
 */
export default function Dashboard() {
  // Start live status updates
  // Updates 5 orders every 2 seconds
  useLiveStatusUpdates(2000, 5)

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Live Crypto Orders & Wallet Dashboard</h1>
        <p className="subtitle">
          Redux Toolkit Demo - 5,000 Orders | Live Status Updates | Wallet Connect
        </p>
      </header>

      <div className="dashboard-content">
        {/* Wallet Panel - Shows wallet connection status */}
        <aside className="wallet-section">
          <WalletPanel />
        </aside>

        {/* Orders Table - Main content area */}
        <main className="orders-section">
          <OrdersTable />
        </main>
      </div>
    </div>
  )
}

