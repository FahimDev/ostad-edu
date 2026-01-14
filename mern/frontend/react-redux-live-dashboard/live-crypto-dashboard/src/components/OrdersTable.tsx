/**
 * OrdersTable Component
 * 
 * Displays a table of crypto orders (5,000 orders for performance demo).
 * 
 * Key concepts demonstrated:
 * - Rendering large arrays efficiently
 * - Using Redux hooks (useAppSelector) to read state
 * - Memoization considerations for performance
 * - Table layout with status badges
 * 
 * Performance notes:
 * - Rendering 5,000 rows is a stress test
 * - In production, consider virtualization (react-window/react-virtualized)
 * - This component shows raw rendering power of React
 */

import { useAppSelector } from '../store/hooks'
import StatusBadge from './StatusBadge'

/**
 * OrdersTable - Displays all orders in a table format
 * 
 * This component:
 * 1. Reads orders from Redux store
 * 2. Renders each order as a table row
 * 3. Shows order details: ID, pair, type, amount, price, status
 * 4. Uses StatusBadge for visual status indication
 */
export default function OrdersTable() {
  // Read orders from Redux store
  // useAppSelector is our typed version of useSelector
  const orders = useAppSelector((state) => state.orders.orders)
  const lastUpdated = useAppSelector((state) => state.orders.lastUpdated)

  // Format number to 2 decimal places
  const formatNumber = (num: number): string => {
    return num.toFixed(2)
  }

  // Format timestamp to readable date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="orders-table-container">
      <div className="table-header">
        <h2>Orders ({orders.length.toLocaleString()})</h2>
        <p className="text-sm text-gray-500">
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
        </p>
      </div>

      {/* Scrollable table container for large datasets */}
      <div className="table-wrapper" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pair</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Price</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="font-mono text-xs">{order.id}</td>
                <td className="font-semibold">{order.pair}</td>
                <td>
                  <span
                    className={`type-badge ${
                      order.type === 'Buy' ? 'type-buy' : 'type-sell'
                    }`}
                  >
                    {order.type}
                  </span>
                </td>
                <td>{formatNumber(order.amount)}</td>
                <td className="font-mono">${formatNumber(order.price)}</td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
                <td className="text-xs text-gray-600">
                  {formatDate(order.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

