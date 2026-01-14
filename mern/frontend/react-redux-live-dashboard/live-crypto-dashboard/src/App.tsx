/**
 * App Component
 * 
 * Root application component with React Router setup.
 * 
 * This component:
 * - Sets up routes using React Router
 * - Includes Navigation component (shows both navigation patterns)
 * - Defines route paths and their corresponding components
 * 
 * Routes:
 * - / (or /dashboard) -> DashboardPage
 * - /orders -> OrdersPage
 * - /wallet -> WalletPage
 */

import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import WalletPage from './pages/WalletPage'
import ParameterPassingDemoPage from './pages/ParameterPassingDemoPage'
import './App.css'

function App() {
  return (
    <div className="app">
      {/* Navigation component demonstrates both navigation patterns */}
      <Navigation />
      
      {/* Routes define which component renders for each URL path */}
      <Routes>
        {/* Route for home/dashboard page */}
        <Route path="/" element={<DashboardPage />} />
        
        {/* Route for orders page */}
        <Route path="/orders" element={<OrdersPage />} />
        
        {/* Route for wallet page */}
        <Route path="/wallet" element={<WalletPage />} />
        
        {/* Route for parameter passing demo page */}
        <Route path="/parameter-demo" element={<ParameterPassingDemoPage />} />
      </Routes>
    </div>
  )
}

export default App
