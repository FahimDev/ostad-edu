/**
 * Wallet Slice - Redux Toolkit Slice
 * 
 * This slice manages wallet connection state (simulating MetaMask-like behavior).
 * 
 * Redux Toolkit concepts demonstrated:
 * - createSlice: Simplifies reducer and action creation
 * - Immer: Built-in, allows "mutating" state safely (it's actually immutable)
 * - Payload actions: Type-safe action creators
 * 
 * State shape:
 * {
 *   isConnected: boolean,
 *   address: string | null,
 *   balance: string
 * }
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// Define the shape of our wallet state
interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string
}

// Initial state - wallet starts disconnected
const initialState: WalletState = {
  isConnected: false,
  address: null,
  balance: '0.00',
}

// createSlice automatically generates:
// - Action creators (connectWallet, disconnectWallet, updateBalance)
// - Reducer function
// - Action types
const walletSlice = createSlice({
  name: 'wallet', // Used as prefix for action types: 'wallet/connectWallet'
  initialState,
  reducers: {
    /**
     * Connect wallet action
     * Simulates connecting to a wallet (like MetaMask)
     * In a real app, this would call wallet provider APIs
     */
    connectWallet: (state, action: PayloadAction<{ address: string; balance: string }>) => {
      // With Immer, we can "mutate" state directly
      // Redux Toolkit converts this to immutable updates under the hood
      state.isConnected = true
      state.address = action.payload.address
      state.balance = action.payload.balance
    },
    
    /**
     * Disconnect wallet action
     * Resets wallet state to initial disconnected state
     */
    disconnectWallet: (state) => {
      state.isConnected = false
      state.address = null
      state.balance = '0.00'
    },
    
    /**
     * Update balance action
     * Allows updating wallet balance without reconnecting
     */
    updateBalance: (state, action: PayloadAction<string>) => {
      state.balance = action.payload
    },
  },
})

// Export actions for use in components
export const { connectWallet, disconnectWallet, updateBalance } = walletSlice.actions

// Export reducer to add to store
export default walletSlice.reducer

