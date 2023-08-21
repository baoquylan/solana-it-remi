import * as React from 'react';
import { useEffect } from 'react';
import { appStore } from '../store/App.store';
import { AnchorProvider } from '@project-serum/anchor';
import useAnchorProvider from '../hooks/useAnchorProvider';
import useTokenAccount from '../hooks/useTokenAccount';
import { useNavigate } from 'react-router-dom';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
    useAnchorWallet,
    ConnectionProvider,
    WalletProvider,
  } from '@solana/wallet-adapter-react';
export default function UserInformation({}): React.ReactNode {
  const navigate = useNavigate();
  const {
    walletAddress,
    solBalance,
    setSOLBalance,
    splBalance,
    setSPLBalance,
  } = appStore();

  const provider: AnchorProvider = useAnchorProvider();
  const userTokenAccount = useTokenAccount({ provider ,address:walletAddress });
  useEffect(() => {
    if (walletAddress && provider) getSOLBalance();
  }, [walletAddress,provider]);
  const getSOLBalance = async () => {
    let walletBalance = await provider.connection.getBalance(walletAddress);
    setSOLBalance(walletBalance / LAMPORTS_PER_SOL);
  };
  useEffect(() => {
    if (userTokenAccount && provider) getSPLBalance();
  }, [userTokenAccount, provider]);
  const getSPLBalance = async () => {
    let walletBalance = await provider.connection.getTokenAccountBalance(
      userTokenAccount
    );
    setSPLBalance(parseFloat(walletBalance.value.amount) / LAMPORTS_PER_SOL);
  };
  return (
    <React.Suspense fallback={null}>
      <div className="lb-sub-title">
        <div>
          <span>
            User Wallet Adress: <span>{walletAddress?.toString()}</span>{' '}
          </span>
          <span style={{ color: 'red' }}>{`(Amount: ${solBalance})`}</span>
        </div>

        {userTokenAccount && (
          <div>
            <span>
              Token Adress: <span>{userTokenAccount?.toString()}</span>{' '}
            </span>
            <span style={{ color: 'red' }}>{`(Amount: ${splBalance})`}</span>
          </div>
        )}
        <p />
        {/* <Button
          // style={{maxWidth:200}}
          type="primary"
          danger
          onClick={ async () => {
          await  solana.disconnect();
            navigate(0);
            // window.location.reload();
          }}
        >
          Disconnect
        </Button> */}
      </div>
    </React.Suspense>
  );
}
