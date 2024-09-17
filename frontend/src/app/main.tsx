// mcbcMERN/frontend/src/app/main.tsx

import { ChakraProvider } from '@chakra-ui/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import { Footer } from '../components/footer/footer';
import Header from '../components/header/header';
import AppRouter from '../routes/router';
import '../styles/global.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider>
      <Router>
        <div className="page-container">
          <Header />
          <AppRouter />
          <Footer />
        </div>
      </Router>
    </ChakraProvider>
  </StrictMode>,
);
