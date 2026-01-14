/**
 * WalletPanel Component
 * 
 * Displays wallet connection status and allows connect/disconnect actions.
 * Simulates MetaMask-like wallet functionality.
 * 
 * Key concepts demonstrated:
 * - Reading state from Redux (useAppSelector)
 * - Dispatching actions to Redux (useAppDispatch)
 * - Conditional rendering based on state
 * - User interaction triggering Redux actions
 * - PROGRAMMATIC NAVIGATION EXAMPLE: Navigate after wallet connection
 * 
 * This component shows:
 * - Global state management (wallet state is available app-wide)
 * - Action dispatching (connect/disconnect buttons trigger Redux actions)
 * - State-driven UI (UI changes based on wallet connection status)
 * - Navigation after state change (programmatic navigation example)
 */

import { useAppSelector, useAppDispatch } from '../store/hooks'
import { connectWallet, disconnectWallet } from '../store/slices/walletSlice'
import { useNavigate } from 'react-router-dom'

/**
 * WalletPanel - Wallet connection interface
 * 
 * Features:
 * - Shows connection status
 * - Connect button (when disconnected)
 * - Disconnect button (when connected)
 * - Displays wallet address and balance when connected
 */
export default function WalletPanel() {
  // Read wallet state from Redux store
  const { isConnected, address, balance } = useAppSelector(
    (state) => state.wallet
  )

  // Get dispatch function to send actions to Redux
  const dispatch = useAppDispatch()

  // PROGRAMMATIC NAVIGATION EXAMPLE:
  // useNavigate hook allows us to navigate programmatically
  // This is useful for navigation after state changes, form submissions, etc.
  const navigate = useNavigate()

  /**
   * Handle wallet connection
   * Simulates connecting to a wallet (like MetaMask)
   * In a real app, this would call wallet provider APIs
   * 
   * PROGRAMMATIC NAVIGATION EXAMPLE:
   * After connecting wallet, navigate to dashboard
   * This shows how to navigate based on user actions/state changes
   */
  const handleConnect = () => {
    // Generate a mock wallet address
    const mockAddress = `0x${Math.random().toString(16).substring(2, 42)}`
    const mockBalance = (Math.random() * 100).toFixed(2)

    // Dispatch action to update Redux state
    dispatch(
      connectWallet({
        address: mockAddress,
        balance: mockBalance,
      })
    )

    // PROGRAMMATIC NAVIGATION:
    // Navigate to dashboard after successful wallet connection
    // This is an example of navigation triggered by code/events
    // You could also use: navigate('/dashboard', { replace: true })
    // or: navigate(-1) to go back, navigate(1) to go forward
    setTimeout(() => {
      navigate('/')
    }, 500) // Small delay to show the connection state change
  }

  /**
   * Handle wallet disconnection
   * Resets wallet state to disconnected
   */
  const handleDisconnect = () => {
    // Dispatch action to reset wallet state
    dispatch(disconnectWallet())
  }

  // Format address for display (show first 6 and last 4 characters)
  const formatAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="wallet-panel">
      <h2>Wallet</h2>

      {isConnected ? (
        // Connected state UI
        <div className="wallet-connected">
          <div className="wallet-info">
            <div className="info-row">
              <span className="label">Status:</span>
              <span className="value status-connected">Connected</span>
            </div>
            <div className="info-row">
              <span className="label">Address:</span>
              <span className="value address">{formatAddress(address!)}</span>
            </div>
            <div className="info-row">
              <span className="label">Balance:</span>
              <span className="value balance">${balance} USD</span>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className="btn btn-disconnect"
            type="button"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        // Disconnected state UI
        <div className="wallet-disconnected">
          <p className="status-text">Not connected</p>
          <button
            onClick={handleConnect}
            className="btn btn-connect"
            type="button"
          >
            Connect Wallet
          </button>
          <p className="help-text">
            Click to simulate wallet connection (MetaMask-like)
          </p>
        </div>
      )}
    </div>
  )
}

