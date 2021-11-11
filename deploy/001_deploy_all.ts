import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployOptions } from "hardhat-deploy/types";
import { DeployResult } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";
import { OrdinaryNFT } from "../typechain-types";
require("dotenv").config();

const ALCHEMY_KEY_LIVE = process.env.ALCHEMY_KEY_POLYGON;
const ALCHEMY_KEY = process.env.ALCHEMY_KEY;
const LIVE_URL = `https://polygon-mainnet.g.alchemyapi.io/v2/${ALCHEMY_KEY_LIVE}`;
const TEST_URL = `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`;
const MAX_AMOUNT = 100;

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, network } = hre;
  const provider = new ethers.providers.JsonRpcProvider(TEST_URL);

  const hdWallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC!);
  const wallet = hdWallet.connect(provider);

  const deployer = wallet.address;

  const { deploy } = deployments;

  const OrdinaryNFT: DeployResult = await deploy("OrdinaryNFT", {
    from: deployer,
    log: true,
  });

  const NFTContract = new ethers.Contract(
    OrdinaryNFT.address,
    ["function batchMint(address to, string[] memory _tokenURI)"],
    wallet
  ) as OrdinaryNFT;

  console.log(`OrdinaryNFT deployed to: ${OrdinaryNFT.address}`);

  const nfts = [];
  for (let i = 0; i < MAX_AMOUNT; i++) {
    nfts.push(
      "https://bafybeiaglbdsnmnqzenuikiefbea7qyw5ibzei7c2xzcjsiqocx24a2zke.ipfs.infura-ipfs.io/"
    );
  }

  const tx = await NFTContract.batchMint(
    NFTContract.address,
    nfts.slice(0, 50),
    {
      gasLimit: 20000000,
      gasPrice: (await wallet.getGasPrice()).mul(2),
    }
  );
  const tx2 = await NFTContract.batchMint(
    NFTContract.address,
    nfts.slice(50, 100),
    {
      gasLimit: 20000000,
      gasPrice: (await wallet.getGasPrice()).mul(2),
    }
  );
  const receipt = await tx.wait();
  const receipt2 = await tx2.wait();
  console.log("batch mint successful: ");
  console.log(receipt);
  console.log(receipt2);
};

export default func;
func.tags = ["All"];
