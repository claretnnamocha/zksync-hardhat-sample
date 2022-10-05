import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { config } from "dotenv";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { utils, Wallet } from "zksync-web3";
config();

const { WALLET_PRIVATE_KEY }: any = process.env;

const bridgeEthFromL1toL2 = async (zkWallet: Wallet) => {
  //   Deposit some funds to L2 in order to be able to perform L2 transactions.
  const depositAmount = ethers.utils.parseEther("0.001");
  const depositHandle = await zkWallet.deposit({
    to: zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: depositAmount,
  });
  // Wait until the deposit is processed on zkSync
  await depositHandle.wait();
};

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Greeter contract`);

  // Initialize the wallet.
  const wallet = new Wallet(WALLET_PRIVATE_KEY);

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("Greeter");

  // !Incase you dont have ETH on zksync
  // bridgeEthFromL1toL2(deployer.zkWallet);

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  // `greeting` is an argument for contract constructor.
  const greeting = "Hi there!";
  const greeterContract = await deployer.deploy(artifact, [greeting]);

  // Show the contract info.
  const contractAddress = greeterContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}
