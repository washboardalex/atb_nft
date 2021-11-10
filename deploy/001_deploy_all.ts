import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployOptions } from "hardhat-deploy/types";
import { DeployResult } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";
import { OrdinaryNFT } from "../typechain-types";
require("dotenv").config();

const ALCHEMY_KEY = process.env.ALCHEMY_KEY_POLYGON;

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, network } = hre;
  console.log(process.env.MNEMONIC);
  const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mainnet.g.alchemyapi.io/v2/${ALCHEMY_KEY}`
  );

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
  for (let i = 0; i < 25; i++) {
    nfts.push(
      "https://storage.cloud.google.com/atb_presentation_nfts/neuron_activation.png"
    );
  }

  const tx = await NFTContract.batchMint(NFTContract.address, nfts); // Add urls to the array, each will become an nft
  const receipt = await tx.wait();
};

export default func;
func.tags = ["All"];
