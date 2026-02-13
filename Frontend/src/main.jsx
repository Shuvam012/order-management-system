import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { WebSocketProvider } from './context/WebSocketContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { OrderProvider } from './context/OrderContext.jsx'

createRoot(document.getElementById('root')).render(
  <WebSocketProvider>
    <AuthProvider>
      <OrderProvider>
        <BrowserRouter>
        <App/>
        </BrowserRouter>
      </OrderProvider>
    </AuthProvider>
  </WebSocketProvider>
)
