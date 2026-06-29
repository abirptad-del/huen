import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg = event.reason?.message || String(event.reason);
    if (msg.includes('Failed to fetch') || msg.includes('Load failed') || msg.includes('NetworkError')) {
      console.warn('Silenced unhandled fetch rejection:', event.reason);
      event.preventDefault(); // Prevents browser or framework error overlay
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (msg.includes('Failed to fetch') || msg.includes('Load failed') || msg.includes('NetworkError')) {
      console.warn('Silenced uncaught fetch error:', event.message);
      event.preventDefault(); // Prevents browser or framework error overlay
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
