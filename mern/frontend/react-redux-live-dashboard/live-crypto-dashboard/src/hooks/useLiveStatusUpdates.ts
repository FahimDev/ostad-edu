/**
 * useLiveStatusUpdates Hook
 * 
 * Custom React hook that simulates live status updates for orders.
 * 
 * This hook demonstrates:
 * - useEffect for side effects
 * - setInterval for periodic updates
 * - Dispatching Redux actions from a hook
 * - Cleanup on unmount
 * 
 * Status progression:
 * Pending → Processing → Completed
 * 
 * This simulates real-time order status changes that you'd see
 * in a live trading dashboard.
 */

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { updateOrderStatus, type OrderStatus } from '../store/slices/ordersSlice'

/**
 * useLiveStatusUpdates - Simulates live order status updates
 * 
 * How it works:
 * 1. Finds orders that can be updated (Pending → Processing, Processing → Completed)
 * 2. Randomly selects a few orders to update
 * 3. Dispatches Redux actions to update their status
 * 4. Repeats every few seconds
 * 
 * @param intervalMs - How often to update (default: 2000ms = 2 seconds)
 * @param updatesPerInterval - How many orders to update each time (default: 5)
 */
export function useLiveStatusUpdates(
  intervalMs: number = 2000,
  updatesPerInterval: number = 5
) {
  const dispatch = useAppDispatch()
  const orders = useAppSelector((state) => state.orders.orders)

  useEffect(() => {
    // Only run if we have orders
    if (orders.length === 0) return

    /**
     * Update function - runs periodically
     * Finds orders that can transition to next status and updates them
     */
    const updateStatuses = () => {
      // Find orders that can be updated
      // Pending orders can become Processing
      // Processing orders can become Completed
      const pendingOrders = orders.filter((o) => o.status === 'Pending')
      const processingOrders = orders.filter((o) => o.status === 'Processing')

      // Randomly select orders to update
      const ordersToUpdate: Array<{ id: string; newStatus: OrderStatus }> = []

      // Update some Pending → Processing
      if (pendingOrders.length > 0) {
        const count = Math.min(
          Math.floor(updatesPerInterval / 2),
          pendingOrders.length
        )
        for (let i = 0; i < count; i++) {
          const randomIndex = Math.floor(Math.random() * pendingOrders.length)
          const order = pendingOrders[randomIndex]
          if (order && !ordersToUpdate.find((o) => o.id === order.id)) {
            ordersToUpdate.push({ id: order.id, newStatus: 'Processing' })
          }
        }
      }

      // Update some Processing → Completed
      if (processingOrders.length > 0) {
        const count = Math.min(
          Math.floor(updatesPerInterval / 2),
          processingOrders.length
        )
        for (let i = 0; i < count; i++) {
          const randomIndex = Math.floor(Math.random() * processingOrders.length)
          const order = processingOrders[randomIndex]
          if (order && !ordersToUpdate.find((o) => o.id === order.id)) {
            ordersToUpdate.push({ id: order.id, newStatus: 'Completed' })
          }
        }
      }

      // Dispatch updates to Redux
      ordersToUpdate.forEach(({ id, newStatus }) => {
        dispatch(updateOrderStatus({ id, status: newStatus }))
      })
    }

    // Set up interval to update statuses periodically
    const intervalId = setInterval(updateStatuses, intervalMs)

    // Cleanup: clear interval when component unmounts
    return () => {
      clearInterval(intervalId)
    }
  }, [dispatch, orders, intervalMs, updatesPerInterval])
}

