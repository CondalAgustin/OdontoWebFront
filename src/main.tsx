import React from 'react'
import ReactDOM from 'react-dom/client'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'aos/dist/aos.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LoaderProvider } from './context/LoaderContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LoaderProvider>
          <App />
        </LoaderProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
