import { useEffect,useState } from 'react';
import {
  Connection,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  AnchorProvider,
} from '@project-serum/anchor';

const network = clusterApiUrl('devnet');
const opts: any = {
  preflightCommitment: 'processed',
};

export default function useAnchorProvider() {
  const [provider, setProvider] = useState<AnchorProvider>();

  useEffect(() => {
    const { solana }: any = window;
    const connection = new Connection('http://127.0.0.1:8899');
    // const connection = new Connection(network, opts.preflightCommitment);
    const anchorProvider = new AnchorProvider(
      connection,
      solana,
      opts.preflightCommitment
    );
    setProvider(anchorProvider);
  }, []);

  return provider;
}
