import { PublicKey } from '@solana/web3.js';
import { create } from 'zustand';

interface AppState {
  isLoading: boolean;
  isPhantomExisting: boolean;
  walletAddress: PublicKey | null;
  fundPublicKey: PublicKey | null;
  solBalance: number;
  splBalance: number;
  solFundBalance: number;
  splFundBalance: number;

  setIsLoading: (value: boolean) => void;
  setIsPhantomExisting: (value: boolean | any) => void;

  setWalletAddress: (value: PublicKey | null) => void;
  setFundPublickey: (value: PublicKey | null) => void;
  setSOLBalance: (value: number) => void;
  setSPLBalance: (value: number) => void;
  setSOLFundBalance: (value: number) => void;
  setSPLFundBalance: (value: number) => void;
}
const initialState = {
  isLoading: false,
  isPhantomExisting: false,
  walletAddress: null,
  fundPublicKey: null,
  solBalance: 0,
  splBalance: 0,
  solFundBalance: 0,
  splFundBalance: 0,
};
export const appStore = create<AppState>((set) => ({
  ...initialState,
  setIsLoading: (value: boolean) => set((state) => ({ isLoading: value })),
  setIsPhantomExisting: (value: boolean) =>
    set((state) => ({ isPhantomExisting: value })),

  setWalletAddress: (value: PublicKey | null) =>
    set((state) => ({ walletAddress: value })),
  setFundPublickey: (value: PublicKey | null) =>
    set((state) => ({ fundPublicKey: value })),
  setSOLBalance: (value: number) => set((state) => ({ solBalance: value })),
  setSPLBalance: (value: number) => set((state) => ({ splBalance: value })),
  setSOLFundBalance: (value: number) => set((state) => ({ solFundBalance: value })),
  setSPLFundBalance: (value: number) => set((state) => ({ splFundBalance: value })),

  resetAppStore: () => set(initialState),
}));
