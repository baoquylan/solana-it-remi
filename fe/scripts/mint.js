const {
  createMint,
  getAccount,
  getMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
  AccountLayout,
} = require('@solana/spl-token');
const {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} = require('@solana/web3.js');

const payer = Keypair.fromSecretKey(
  Uint8Array.from([
    128, 108, 3, 128, 143, 181, 196, 60, 32, 14, 238, 207, 98, 88, 24, 65, 39,
    67, 32, 250, 54, 173, 253, 61, 223, 226, 219, 68, 230, 224, 160, 98, 197,
    139, 127, 40, 23, 169, 78, 202, 223, 22, 48, 238, 82, 84, 210, 85, 185, 179,
    187, 145, 149, 124, 203, 34, 149, 32, 69, 133, 87, 35, 73, 157,
  ])
);
const mintAuthority = Keypair.generate();

// const connection = new Connection('http://127.0.0.1:8899');
const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');

const checkTokenAccounts = async () => {
  
  const tokenAccounts = await connection.getTokenAccountsByOwner(
    payer.publicKey,
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );

  console.log('Token                                         Balance');
  console.log('------------------------------------------------------------');
  tokenAccounts.value.forEach((tokenAccount) => {
    const accountData = AccountLayout.decode(tokenAccount.account.data);
    console.log(`${new PublicKey(accountData.mint)}   ${accountData.amount}`);
  });
};
const createSPLToken = async () => {
  const mint = await createMint(
    connection,
    payer,
    mintAuthority.publicKey,
    null,
    8
  );

  console.log(mint.toBase58());

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );



  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    mintAuthority,
    1000000 *LAMPORTS_PER_SOL
  );
  // const mintInfo = await getMint(connection, new PublicKey('FCn9B1uTEsVevM89NCsJPvvcKwSpRrFCXSkYedSkje4U'));
  checkTokenAccounts();
};
// const mint= async()=>{
//   let mintAccount = new PublicKey('DtKoLP7vEyMBP8muouk939yLysg4Y6kgeotkJnREKjnW')
//   const tokenAccount = await getOrCreateAssociatedTokenAccount(
//     connection,
//     payer,
//     mintAccount,
//     payer.publicKey
//   );

//   await mintTo(
//     connection,
//     payer,
//     mintAccount,
//     tokenAccount.address,
//     mintAuthority,
//     1000 *LAMPORTS_PER_SOL
//   );
// }
// mint()
createSPLToken();
