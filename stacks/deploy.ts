import {
  broadcastTransaction,
  makeContractDeploy,
  privateKeyToAddress,
} from "@stacks/transactions";
import { Account, Wallet, generateWallet } from "@stacks/wallet-sdk";
import { readFileSync } from "fs";

async function deployContract() {
  const wallet: Wallet = await generateWallet({
    secretKey: process.env.STACKS_SEED!,
    password: "optional-encryption-password",
  });

  const account: Account = wallet.accounts[0];

  const mainnetAddress = privateKeyToAddress(account.stxPrivateKey, "mainnet");

  // Read contract source code
  const contractSource = readFileSync(
    "contracts/stacks/contract.clar",
    "utf-8",
  );

  const transaction = await makeContractDeploy({
    contractName: "my-counter",
    codeBody: contractSource,
    senderKey: account.stxPrivateKey,
    network: "mainnet",
    // fee: 10000,
  });

  const broadcastResponse = await broadcastTransaction({
    transaction,
    network: "mainnet",
  });

  console.log("Contract deployed!");
  console.log("Transaction ID:", broadcastResponse.txid);
  console.log("Contract address:", `${mainnetAddress}.${"my-counter"}`);
}

deployContract();
