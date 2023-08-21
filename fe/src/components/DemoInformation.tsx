import * as React from 'react';

import { appStore } from '../store/App.store';
import UserInformation from './UserInformation';
import { useAnchorWallet } from '@solana/wallet-adapter-react';

interface DemoInformation {
  children: React.ReactNode;
}

export default function DemoInformation({
  children,
}: DemoInformation): React.ReactNode {
  const { walletAddress } = appStore();
  const { solana }: any = window;
  const wallet = useAnchorWallet();
  console.log(wallet)
  return (
    <React.Suspense fallback={null}>
      <div className="lb-header">
        <div className="lb-title">
          <span>DEMO</span>
        </div>
        {walletAddress && (
         <UserInformation/>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    </React.Suspense>
  );
}
