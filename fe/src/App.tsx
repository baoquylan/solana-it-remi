import * as React from 'react'
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home.page';
import { appStore } from './store/App.store';

export default function App() {
  const { setIsPhantomExisting ,setWalletAddress, setIsLoading} = appStore();
  useEffect(() => {
    window.addEventListener('load', checkWalletConntected);
    return () => {
      window.removeEventListener('load', checkWalletConntected);
    };
  }, []);
  const checkWalletConntected = async () => {
    try {
      setIsLoading(true)
      const { solana }: any = window;
      if (solana) {
        if (solana.isPhantom) {
          setIsPhantomExisting(true);
          const response = await solana.connect({
            onlyIfTrusted: true,
          });
          setWalletAddress(response?.publicKey);
        }
      } else {
        alert('Solana object not found! Get a Phamtom wallet');
      }
      setIsLoading(false)
    } catch (ex) {
      //   message.warning(ex);
      setIsLoading(false)
    }
  };
  return (
    <>
      <Routes>
        <Route index element={<HomePage />} />
      </Routes>
    </>
  );
}
