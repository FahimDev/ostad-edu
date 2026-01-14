/**
 * OrdersPage Component
 * 
 * Dedicated page for viewing orders.
 * Demonstrates navigation to a separate route.
 */

import OrdersTable from '../components/OrdersTable'
import { useLiveStatusUpdates } from '../hooks/useLiveStatusUpdates'

export default function OrdersPage() {
  // Start live updates on this page too
  useLiveStatusUpdates(2000, 5)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Orders</h1>
        <p>View all crypto orders in detail</p>
      </div>
      <OrdersTable />
    </div>
  )
}

