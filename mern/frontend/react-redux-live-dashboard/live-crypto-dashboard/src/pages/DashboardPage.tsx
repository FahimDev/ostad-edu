/**
 * DashboardPage Component
 * 
 * Main dashboard page that displays wallet and orders.
 * This is a route component (accessed via /dashboard or /)
 * 
 * PARAMETER PASSING EXAMPLE:
 * This page could pass parameters to Dashboard component if needed.
 * Currently Dashboard doesn't need parameters, but here's how you would do it:
 * 
 * <Dashboard title="Custom Title" showHeader={true} />
 */

import Dashboard from '../components/Dashboard'

export default function DashboardPage() {
  // PARAMETER PASSING EXAMPLE (commented out since Dashboard doesn't accept props):
  // If Dashboard component accepted parameters, you would pass them like this:
  //
  // const pageTitle = 'Live Crypto Orders & Wallet Dashboard'
  // const showSubtitle = true
  //
  // return (
  //   <Dashboard 
  //     title={pageTitle}        // Passing string parameter
  //     showSubtitle={showSubtitle}  // Passing boolean parameter
  //   />
  // )

  // Currently Dashboard doesn't need parameters, so we just render it
  return <Dashboard />
}

