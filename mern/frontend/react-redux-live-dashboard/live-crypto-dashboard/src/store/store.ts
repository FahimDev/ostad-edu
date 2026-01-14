/**
 * Redux Store Configuration
 * 
 * This file sets up the Redux store using Redux Toolkit.
 * 
 * Key concepts demonstrated:
 * - configureStore: RTK's recommended way to create a store
 * - DevTools: Automatically enabled in development for time-travel debugging
 * - Reducer combination: We'll add slices here as we build them
 */

import { configureStore } from '@reduxjs/toolkit'

// Import our slices
import walletReducer from './slices/walletSlice'
import ordersReducer from './slices/ordersSlice'

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    orders: ordersReducer,
  },
  // DevTools are automatically enabled in development
  // This allows us to see actions, state changes, and time-travel debug
  devTools: process.env.NODE_ENV !== 'production',
})

// TypeScript types for better type safety
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

