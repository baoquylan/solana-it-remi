import * as React from 'react';
import { Button, message } from 'antd';
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import SwapForm from '../components/Swap.form';
import { appStore } from '../store/App.store';
import DemoInformation from '../components/DemoInformation';
import Fund from '../components/Fund';
import useAnchorProvider from '../hooks/useAnchorProvider';
import useTokenAccount from '../hooks/useTokenAccount';
import { AnchorProvider, BN, Idl, Program, web3 } from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { useNavigate } from 'react-router-dom';
import {
  useAnchorWallet,
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";

const idl: { [key: string]: any } = require('../idl.json');
const programId = new PublicKey(idl.metadata.address);
const keys: { [key: string]: any } = require('../keys.json');
const mint = new PublicKey(keys.mintPublickey);

let publicKeyFund = new PublicKey(keys.fundAccount);
export default function HomePage(): JSX.Element {
  const phantomWallet = new PhantomWalletAdapter();
  const navigate = useNavigate();
  const {
    isPhantomExisting,
    walletAddress,
    setWalletAddress,
    isLoading,
    setIsLoading,
    fundPublicKey,
  } = appStore();
  const provider: AnchorProvider = useAnchorProvider();
  const userTokenAccount = useTokenAccount({
    provider,
    address: walletAddress,
  });
  const fundTokenAccount = useTokenAccount({
    provider,
    address: publicKeyFund,
  });
  const connectWallet = async () => {
    try {
      const { solana }: any = window;
      if (solana) {
        const response = await solana.connect();
        setWalletAddress(response?.publicKey);
      }
    } catch {}
  };

  const handleInitCustomToken = async () => {
    try {
      setIsLoading(true);
      const { solana }: any = window;
      let walletBalance = await provider.connection.getBalance(walletAddress);
      console.log(walletBalance / LAMPORTS_PER_SOL);
      if (walletBalance / LAMPORTS_PER_SOL < 1) {
        message.warning('You dont have enough SOL');
        return;
      }
      let associatedTokenAddress = await getAssociatedTokenAddress(
        mint,
        walletAddress
      );
      const transaction = new web3.Transaction().add(
        createAssociatedTokenAccountInstruction(
          walletAddress,
          associatedTokenAddress,
          walletAddress,
          mint,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
      let blockhashObj = await provider.connection.getRecentBlockhash();
      transaction.feePayer = walletAddress;
      transaction.recentBlockhash = await blockhashObj.blockhash;
      let signature = await solana.signAndSendTransaction(transaction);
      await provider.connection.confirmTransaction(signature);
      navigate(0);
      setIsLoading(false);
    } catch (ex) {
      console.log(ex);
      setIsLoading(false);
    }
  };

  const swapToSol = async (e) => {
    let { solana }: any = window;
    let amount = new BN(parseFloat(e));

    let idll = idl as Idl;
    const program = new Program(idll, programId, provider);
    // await program.methods.swapToSol(amount).accounts(
    //    {
    //     fund: fundPublicKey,
    //     user: provider.wallet.publicKey,

    //     from: provider.wallet.publicKey,
    //     fromAta: userTokenAccount,
    //     toAta: fundTokenAccount,

    //     systemProgram:web3.SystemProgram.programId,
    //     tokenProgram: TOKEN_PROGRAM_ID,
    //   })
    //   .signers([provider.wallet])
    // });

    // const transaction = new web3.Transaction().add(
    //   program.methods.swapToSol(amount, {
    //     accounts: {
    //       fund: fundPublicKey,
    //       user: walletAddress,

    //       from: walletAddress,
    //       fromAta: userTokenAccount,
    //       toAta: fundTokenAccount,

    //       systemProgram: web3.SystemProgram.programId,
    //       tokenProgram: TOKEN_PROGRAM_ID,
    //     },
    //   })
    // );
    let wallet = solana as Keypair;
    let dd = wallet.secretKey;
    const utf8EncodeText = new TextEncoder();
    const payer = Keypair.fromSecretKey(
      // utf8EncodeText.encode('56H7PXLPWZNDqfuYfgCXnMSa9nJsvDz7dv5ad2wUuvukaNyHX9BgaXdkCn3Wacu73nXxML76KDGtYQ8spDhGcAb4')
      Uint8Array.from([
        128, 108, 3, 128, 143, 181, 196, 60, 32, 14, 238, 207, 98, 88, 24, 65,
        39, 67, 32, 250, 54, 173, 253, 61, 223, 226, 219, 68, 230, 224, 160, 98,
        197, 139, 127, 40, 23, 169, 78, 202, 223, 22, 48, 238, 82, 84, 210, 85,
        185, 179, 187, 145, 149, 124, 203, 34, 149, 32, 69, 133, 87, 35, 73,
        157,
      ])
    );
    await program.rpc.swapToSol(amount, {
      accounts: {
        fund: fundPublicKey,
        user: walletAddress,

        from: walletAddress,
        fromAta: userTokenAccount,
        toAta: fundTokenAccount,

        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [solana],
    });
  };
  return (
    <React.Suspense fallback={null}>
        <ConnectionProvider endpoint={'http://127.0.0.1:8899'}>
      <WalletProvider wallets={[phantomWallet]}>
      <div className="lb-container">
        <DemoInformation>{walletAddress && <Fund />}</DemoInformation>
        <div className="lb-swap-container">
          {walletAddress ? (
            !userTokenAccount ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span>You have to init a token account before swap them</span>
                <Button
                  style={{ maxWidth: 270 }}
                  type="primary"
                  onClick={handleInitCustomToken}
                  disabled={isLoading}
                  loading={isLoading}
                >
                  Initial custom token to your Account
                </Button>
              </div>
            ) : (
              <>
                <SwapForm
                  title="MOVE -> SOL"
                  type="SOL"
                  handleSwap={swapToSol}
                />
                <SwapForm
                  title="SOL -> MOVE"
                  type="MOVE"
                  handleSwap={swapToSol}
                />
              </>
            )
          ) : (
            <Button
              type="primary"
              onClick={connectWallet}
              disabled={!isPhantomExisting}
              loading={isLoading}
            >
              Connect Phantom Wallet
            </Button>
          )}
        </div>
      </div>
      </WalletProvider>
    </ConnectionProvider>
    </React.Suspense>
  );
}
