/**
 * StatusBadge Component
 * 
 * A reusable component that displays order status with color coding.
 * 
 * Props:
 * - status: The order status (Pending, Processing, Completed)
 * 
 * This component demonstrates:
 * - Conditional styling based on props
 * - TypeScript prop types
 * - Visual feedback for different states
 */

import type { OrderStatus } from '../store/slices/ordersSlice'

interface StatusBadgeProps {
  status: OrderStatus
}

/**
 * StatusBadge - Visual indicator for order status
 * 
 * Color coding:
 * - Pending: Yellow/Orange (waiting)
 * - Processing: Blue (in progress)
 * - Completed: Green (done)
 */
export default function StatusBadge({ status }: StatusBadgeProps) {
  // Determine badge color and style based on status
  const getStatusStyle = (status: OrderStatus): string => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <span className={`status-badge ${getStatusStyle(status)}`}>
      {status}
    </span>
  )
}

