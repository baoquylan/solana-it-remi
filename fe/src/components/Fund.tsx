import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Program, utils, Idl } from '@project-serum/anchor';
import useAnchorProvider from '../hooks/useAnchorProvider';
import { web3 } from '@project-serum/anchor';
import { appStore } from '../store/App.store';
import useTokenAccount from '../hooks/useTokenAccount';

const idl: { [key: string]: any } = require('../idl.json');
const keys: { [key: string]: any } = require('../keys.json');
// const idl ={metadata:{address:''}}
const programId = new PublicKey(idl.metadata.address);
const { SystemProgram } = web3;


let publicKeyFund =new PublicKey(keys.fundAccount)
export default function Fund() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [funds, setFunds] = useState<Array<any>>([]);
  const {
    setFundPublickey,
    walletAddress,
    fundPublicKey,
    setSOLFundBalance,
    setSPLFundBalance,
    solFundBalance,
    splFundBalance,
  } = appStore();
  const provider = useAnchorProvider();
  const fundTokenAccount = useTokenAccount({
    provider,
    address: publicKeyFund,
  });
  useEffect(() => {
    if (provider) {
      getFund();
    }
  }, [provider]);

  const getFund = async () => {
    setIsLoading(true);
    let idll = idl as Idl;
    const program = new Program(idll, programId, provider);
    Promise.all(
      (await provider.connection.getProgramAccounts(programId)).map(
        async (fund: any) => ({
          ...(await program.account.fund.fetch(fund.pubkey)),
          pubkey: fund.pubkey,
        })
      )
    ).then((funds) => {
      if (funds.length !== 0) {
        setFundPublickey(funds[0].pubkey);
      }
      setFunds(funds);
      setIsLoading(false);
    });
  };

  const createFund = async () => {
    try {
      let idll = idl as Idl;
      const program = new Program(idll, programId, provider);
      const [fund] = await PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('FUND_TOKEN'), walletAddress.toBuffer()],
        program.programId
      );
      await program.rpc.create({
        accounts: {
          fund,
          user: walletAddress,
          systemProgram: SystemProgram.programId,
        },
      });
      setFundPublickey(fund);
    } catch (ex) {
      message.warning('Error');
      console.log(ex);
    }
  };

  useEffect(() => {
    if (fundTokenAccount && fundTokenAccount) getFundBalance();
  }, [fundPublicKey, fundTokenAccount]);
  const getFundBalance = async () => {
    try{
        let walletSOLBalance = await provider.connection.getBalance(fundPublicKey);
        let walletSPLBalance = await provider.connection.getTokenAccountBalance(
          fundTokenAccount
        );
        setSOLFundBalance(walletSOLBalance / LAMPORTS_PER_SOL)
        setSPLFundBalance(parseFloat(walletSPLBalance.value.amount) / LAMPORTS_PER_SOL)
    }catch{

    }

  };

  return (
    <React.Suspense
      fallback={<span style={{ color: 'white' }}>Loading...</span>}
    >
      {isLoading ? (
        <span style={{ color: 'white' }}>Loading...</span>
      ) : funds.length === 0 ? (
        <Button type="primary" onClick={createFund}>
          Create Fund
        </Button>
      ) : (
        // funds.map((fund) => (
        //   <>
        //     <span style={{ color: 'white' }}>
        //       Fund ID: {fund.pubkey.toString()}
        //     </span>
        //   </>
        // ))
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            alignItems: 'center',
          }}
        >
          <span>Fund ID: {fundPublicKey.toString()}</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ color: 'red' }}>
              Amount SQL: {solFundBalance}
            </span>
            <span>|</span>
            <span style={{ color: 'red' }}>
              Amount SPL: {splFundBalance}
            </span>
          </div>
        </div>
      )}
    </React.Suspense>
  );
}
