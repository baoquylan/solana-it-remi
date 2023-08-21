import * as React from 'react';
import './scss/index.scss';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import "@solana/wallet-adapter-react-ui/styles.css";
const root = createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: 'black',
        fontFamily:'Ubuntu'
      },
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ConfigProvider>
);
