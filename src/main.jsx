import './debug';
import './polyfills';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { WalletProvider } from './context/WalletContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ToastProvider>
            <WalletProvider>
                <App />
            </WalletProvider>
        </ToastProvider>
    </React.StrictMode>,
)
