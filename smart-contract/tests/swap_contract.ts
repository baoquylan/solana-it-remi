import assert from "assert";
import * as anchor from "@project-serum/anchor";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  createAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  mintTo,
  MINT_SIZE,
} from "@solana/spl-token";
import { Connection, clusterApiUrl } from "@solana/web3.js";

describe("swap_contract", async () => {


  // const connection = new Connection("http://127.0.0.1:8899");
  const RADIO = 10;
  const program = anchor.workspace.SwapContract;
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const payer = anchor.web3.Keypair.generate();
  const endUser = anchor.web3.Keypair.generate();

  let fund, tokenAccountFund, tokenAccountEndUser;

  it("create fund", async () => {
    [fund] = await anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("FUND_TOKEN"),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );
    await program.rpc.create({
      accounts: {
        fund: fund,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    });
  });
  it("airdrop", async () => {
    let amount = 100 * anchor.web3.LAMPORTS_PER_SOL;
    let fromAirdropSignature = await provider.connection.requestAirdrop(
      fund,
      amount
    );
    await provider.connection.confirmTransaction(fromAirdropSignature);

    fromAirdropSignature = await provider.connection.requestAirdrop(
      payer.publicKey,
      amount
    );
    await provider.connection.confirmTransaction(fromAirdropSignature);

    fromAirdropSignature = await provider.connection.requestAirdrop(
      endUser.publicKey,
      amount
    );
    await provider.connection.confirmTransaction(fromAirdropSignature);
  });
  it("mint", async () => {
    const mint = await createMint(
      provider.connection,
      payer,
      payer.publicKey,
      null,
      8
    );

    tokenAccountFund = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      mint,
      provider.wallet.publicKey
    );
    tokenAccountEndUser = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      mint,
      endUser.publicKey
    );

    await mintTo(
      provider.connection,
      payer,
      mint,
      tokenAccountFund.address,
      payer.publicKey,
      100 * anchor.web3.LAMPORTS_PER_SOL
    );
    await mintTo(
      provider.connection,
      payer,
      mint,
      tokenAccountEndUser.address,
      payer.publicKey,
      1000000* anchor.web3.LAMPORTS_PER_SOL
    );
  });
  it("swap sol", async () => {
    let fundSplBalanceInit = await provider.connection.getTokenAccountBalance(
      tokenAccountFund.address
    );
    let ensUserSplBalanceInit =
      await provider.connection.getTokenAccountBalance(
        tokenAccountEndUser.address
      );
    let endUserSolBalanceInit = await provider.connection.getBalance(
      endUser.publicKey
    );
    let fundSolBalanceInit = await provider.connection.getBalance(fund);
    let amount = new anchor.BN(1);
    await program.rpc.swapToSol(amount, {
      accounts: {
        fund: fund,
        user: endUser.publicKey,

        from: endUser.publicKey,
        fromAta: tokenAccountEndUser.address,
        toAta: tokenAccountFund.address,

        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [endUser],
    });

    let fundSplBalance = await provider.connection.getTokenAccountBalance(
      tokenAccountFund.address
    );
    let ensUserSplBalance = await provider.connection.getTokenAccountBalance(
      tokenAccountEndUser.address
    );
    let endUserSolBalance = await provider.connection.getBalance(
      endUser.publicKey
    );
    let fundSolBalance = await provider.connection.getBalance(fund);
    // console.log(
    //   "swap sol",
    //   ensUserSplBalance.value.amount ,
    //   fundSplBalance.value.amount,
    //   endUserSolBalance / anchor.web3.LAMPORTS_PER_SOL,
    //   fundSolBalance / anchor.web3.LAMPORTS_PER_SOL
    // );

    assert.strictEqual(
      Math.abs(endUserSolBalanceInit - endUserSolBalance) /
        anchor.web3.LAMPORTS_PER_SOL,
      amount.toNumber() / RADIO
    );
    assert.strictEqual(
      Math.abs(fundSolBalanceInit - fundSolBalance) /
        anchor.web3.LAMPORTS_PER_SOL,
      amount.toNumber() / RADIO
    );
    assert.strictEqual(
      Math.abs(
        parseFloat(ensUserSplBalanceInit.value.amount) -
          parseFloat(ensUserSplBalance.value.amount)
      ) /anchor.web3.LAMPORTS_PER_SOL,
      amount.toNumber()
    );
    assert.strictEqual(
      Math.abs(
        parseFloat(fundSplBalanceInit.value.amount) -
          parseFloat(fundSplBalance.value.amount)
      )/anchor.web3.LAMPORTS_PER_SOL,
      amount.toNumber()
    );
  });
  it("swap spl", async () => {
    let fundSplBalanceInit = await provider.connection.getTokenAccountBalance(
      tokenAccountFund.address
    );
    let ensUserSplBalanceInit =
      await provider.connection.getTokenAccountBalance(
        tokenAccountEndUser.address
      );
    let endUserSolBalanceInit = await provider.connection.getBalance(
      endUser.publicKey
    );
    let fundSolBalanceInit = await provider.connection.getBalance(fund);
    let amount = new anchor.BN(10);
    await program.rpc.swapToSpl(amount, {
      accounts: {
        fund: fund,
        user: endUser.publicKey,

        from: provider.wallet.publicKey,
        fromAta: tokenAccountFund.address,
        toAta: tokenAccountEndUser.address,

        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [endUser],
    });
    let fundSplBalance = await provider.connection.getTokenAccountBalance(
      tokenAccountFund.address
    );
    let ensUserSplBalance = await provider.connection.getTokenAccountBalance(
      tokenAccountEndUser.address
    );
    let endUserSolBalance = await provider.connection.getBalance(
      endUser.publicKey
    );
    let fundSolBalance = await provider.connection.getBalance(fund);
    // console.log(
    //   "swap spl",
    //   ensUserSplBalance.value.amount,
    //   fundSplBalance.value.amount,
    //   endUserSolBalance / anchor.web3.LAMPORTS_PER_SOL,
    //   fundSolBalance / anchor.web3.LAMPORTS_PER_SOL
    // );

    assert.strictEqual(
      Math.abs(endUserSolBalanceInit - endUserSolBalance) /
        anchor.web3.LAMPORTS_PER_SOL,
      amount.toNumber() 
    );
    assert.strictEqual(
      Math.abs(fundSolBalanceInit - fundSolBalance) /
        anchor.web3.LAMPORTS_PER_SOL ,
      amount.toNumber() 
    );
    assert.strictEqual(
      Math.abs(
        parseFloat(ensUserSplBalanceInit.value.amount) -
          parseFloat(ensUserSplBalance.value.amount)
      )/anchor.web3.LAMPORTS_PER_SOL,
      amount.toNumber() *RADIO
    );
    assert.strictEqual(
      Math.abs(
        parseFloat(fundSplBalanceInit.value.amount) -
          parseFloat(fundSplBalance.value.amount)
      )/anchor.web3.LAMPORTS_PER_SOL,
      amount.toNumber()*RADIO
    );
  });
});
