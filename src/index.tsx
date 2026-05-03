import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { ThemeProvider } from './styles/theme/theme-provider';
import { initializeProjectKey } from './lib/utils/project-key';

initializeProjectKey();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <App />
    </ThemeProvider>
  </StrictMode>
);
