/**
 * Orders Slice - Redux Toolkit Slice
 * 
 * This slice manages crypto orders (5,000 orders for performance demo).
 * 
 * Key concepts:
 * - Large array handling: Demonstrates rendering 5,000 items efficiently
 * - Status updates: Orders transition through Pending → Processing → Completed
 * - Immutable updates: Using Immer to safely update nested state
 * 
 * State shape:
 * {
 *   orders: Order[],
 *   lastUpdated: number
 * }
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// Order status types - these will transition in sequence
export type OrderStatus = 'Pending' | 'Processing' | 'Completed'

// Order interface - represents a single crypto order
export interface Order {
  id: string
  pair: string // e.g., "BTC/USD"
  type: 'Buy' | 'Sell'
  amount: number
  price: number
  status: OrderStatus
  timestamp: number
}

// State interface
interface OrdersState {
  orders: Order[]
  lastUpdated: number
}

// Helper function to generate a random order
const generateOrder = (id: number): Order => {
  const pairs = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'ADA/USD', 'DOT/USD']
  const types: ('Buy' | 'Sell')[] = ['Buy', 'Sell']
  
  return {
    id: `ORD-${String(id).padStart(6, '0')}`,
    pair: pairs[Math.floor(Math.random() * pairs.length)],
    type: types[Math.floor(Math.random() * types.length)],
    amount: Math.random() * 10 + 0.1, // Random amount between 0.1 and 10.1
    price: Math.random() * 50000 + 1000, // Random price
    status: 'Pending', // All start as Pending
    timestamp: Date.now() - Math.random() * 86400000, // Random time in last 24h
  }
}

// Generate 5,000 orders for performance demonstration
const generateOrders = (count: number): Order[] => {
  return Array.from({ length: count }, (_, i) => generateOrder(i + 1))
}

// Initial state with 5,000 orders
const initialState: OrdersState = {
  orders: generateOrders(5000),
  lastUpdated: Date.now(),
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    /**
     * Update order status
     * Changes a single order's status (for live updates demo)
     */
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: OrderStatus }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.id)
      if (order) {
        order.status = action.payload.status
        state.lastUpdated = Date.now()
      }
    },
    
    /**
     * Update multiple orders at once
     * Useful for batch status updates
     */
    updateMultipleOrderStatuses: (
      state,
      action: PayloadAction<Array<{ id: string; status: OrderStatus }>>
    ) => {
      action.payload.forEach(({ id, status }) => {
        const order = state.orders.find((o) => o.id === id)
        if (order) {
          order.status = status
        }
      })
      state.lastUpdated = Date.now()
    },
    
    /**
     * Reset all orders
     * Useful for demo/testing purposes
     */
    resetOrders: (state) => {
      state.orders = generateOrders(5000)
      state.lastUpdated = Date.now()
    },
  },
})

// Export actions
export const { updateOrderStatus, updateMultipleOrderStatuses, resetOrders } =
  ordersSlice.actions

// Export reducer
export default ordersSlice.reducer

