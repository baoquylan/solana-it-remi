import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { AnchorProvider, web3 } from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  AccountLayout,
} from '@solana/spl-token';

import { appStore } from '../store/App.store';
import { Buffer } from 'buffer';
window.Buffer = Buffer;
const keys: { [key: string]: any } = require('../keys.json');

const mint = new PublicKey(keys.mintPublickey);
interface UseTokenAccount {
  provider: AnchorProvider;
  address: PublicKey
}
export default function useTokenAccount({
  provider, address
}: UseTokenAccount): PublicKey {
  const [userTokenAccount, setUserTokenAcount] = useState<PublicKey>();
  
  useEffect(() => {
    if (provider && address) run();
  }, [provider, address]);
  const run = async () => {
    try {
      const tokenAccounts = await provider.connection.getTokenAccountsByOwner(
        address,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );

      let index = tokenAccounts.value.findIndex((tokenAccount) => {
        const accountData = AccountLayout.decode(tokenAccount.account.data);
        return accountData.mint.toBase58() === mint.toBase58();
      });
      let associatedTokenAddress = await getAssociatedTokenAddress(
        mint,
        address
      );
      if(index>=0){
        setUserTokenAcount(associatedTokenAddress);
      }
    //   if (index < 0) {
    //     const { solana }: any = window;
    //     const transaction = new web3.Transaction().add(
    //       createAssociatedTokenAccountInstruction(
    //         walletAddress,
    //         associatedTokenAddress,
    //         walletAddress,
    //         mint,
    //         TOKEN_PROGRAM_ID,
    //         ASSOCIATED_TOKEN_PROGRAM_ID
    //       )
    //     );
    //     let blockhashObj = await provider.connection.getRecentBlockhash();
    //     transaction.feePayer = walletAddress;
    //     transaction.recentBlockhash = await blockhashObj.blockhash;
    //     await solana.signAndSendTransaction(transaction);
    //     setUserTokenAcount(associatedTokenAddress);
    //   }
    
    } catch (ex) {
      console.log(ex);
    }
  };
  return userTokenAccount;
}
