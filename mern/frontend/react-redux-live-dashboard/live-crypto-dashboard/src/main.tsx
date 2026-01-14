/**
 * Application Entry Point
 * 
 * This is where React mounts to the DOM and where we wrap our app
 * with the Redux Provider and React Router BrowserRouter.
 * 
 * Setup:
 * - Redux Provider: Makes store available to all components
 * - BrowserRouter: Enables routing/navigation throughout the app
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store/store'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Redux Provider: Makes store available to all components */}
    <Provider store={store}>
      {/* BrowserRouter: Enables routing and navigation */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
