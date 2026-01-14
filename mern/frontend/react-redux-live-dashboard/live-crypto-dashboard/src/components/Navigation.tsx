/**
 * Navigation Component
 * 
 * Demonstrates TWO navigation patterns:
 * 
 * 1. LINK-BASED NAVIGATION (Declarative)
 *    - Uses <Link> components from react-router-dom
 *    - User clicks links to navigate
 *    - Browser back/forward buttons work
 *    - URL changes reflect current page
 * 
 * 2. PROGRAMMATIC NAVIGATION (Imperative)
 *    - Uses useNavigate() hook
 *    - Navigation triggered by code/events
 *    - Example: "Go to Dashboard" button
 *    - Useful for redirects, form submissions, etc.
 */

import { Link, useNavigate, useLocation } from 'react-router-dom'

/**
 * Navigation - Main navigation component
 * 
 * Shows both navigation patterns:
 * - Link-based: Click nav links
 * - Programmatic: Click "Quick Actions" buttons
 */
export default function Navigation() {
  // PROGRAMMATIC NAVIGATION EXAMPLE:
  // useNavigate hook gives us a function to navigate programmatically
  const navigate = useNavigate()
  
  // Get current location to highlight active link
  const location = useLocation()

  /**
   * Programmatic navigation handler
   * This function is called when user clicks a button
   * Instead of using <Link>, we call navigate() function
   */
  const handleProgrammaticNavigate = (path: string) => {
    // Navigate to a route programmatically
    // This is useful for:
    // - Redirects after form submission
    // - Conditional navigation
    // - Navigation from event handlers
    navigate(path)
  }

  // Check if a route is active (for styling active links)
  const isActive = (path: string): boolean => {
    return location.pathname === path
  }

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>Crypto Dashboard</h2>
      </div>

      {/* EXAMPLE 1: LINK-BASED NAVIGATION */}
      {/* Using <Link> components - declarative navigation */}
      <div className="nav-links">
        <Link
          to="/"
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link
          to="/orders"
          className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
        >
          Orders
        </Link>
        <Link
          to="/wallet"
          className={`nav-link ${isActive('/wallet') ? 'active' : ''}`}
        >
          Wallet
        </Link>
        <Link
          to="/parameter-demo"
          className={`nav-link ${isActive('/parameter-demo') ? 'active' : ''}`}
        >
          Parameter Demo
        </Link>
      </div>

      {/* EXAMPLE 2: PROGRAMMATIC NAVIGATION */}
      {/* Using navigate() function - imperative navigation */}
      <div className="nav-actions">
        <span className="nav-label">Quick Actions:</span>
        <button
          onClick={() => handleProgrammaticNavigate('/')}
          className="nav-button"
          type="button"
        >
          Go to Dashboard
        </button>
        <button
          onClick={() => handleProgrammaticNavigate('/orders')}
          className="nav-button"
          type="button"
        >
          View Orders
        </button>
        <button
          onClick={() => handleProgrammaticNavigate('/wallet')}
          className="nav-button"
          type="button"
        >
          Open Wallet
        </button>
      </div>
    </nav>
  )
}

