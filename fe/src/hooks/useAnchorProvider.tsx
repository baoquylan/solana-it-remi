import { useEffect, useState } from 'react';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider } from '@project-serum/anchor';

const network = clusterApiUrl('devnet');
const opts: any = {
  preflightCommitment: 'processed',
};

export default function useAnchorProvider() {
  const [provider, setProvider] = useState<AnchorProvider>();

  useEffect(() => {
    const { solana }: any = window;
    let connection;
    if (process.env.EnvType === 'localhost') {
      connection = new Connection('http://127.0.0.1:8899');
    } else if (process.env.EnvType === 'devnet'){
      const network = clusterApiUrl('devnet');
      connection = new Connection(network, opts.preflightCommitment);
    }else if (process.env.EnvType === 'testnet'){
      const network = clusterApiUrl('testnet');
      connection = new Connection(network, opts.preflightCommitment);
    }

    const anchorProvider = new AnchorProvider(
      connection,
      solana,
      opts.preflightCommitment
    );
    setProvider(anchorProvider);
  }, []);

  return provider;
}
