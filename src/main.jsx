import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import AppRoutes from './app/appRouter';
import ScrollToTop from './app/ScrollToTop';
import { LanguageProvider } from './i18n/LanguageContext';
import './css/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
)
