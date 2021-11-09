import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployOptions } from "hardhat-deploy/types";
import { DeployResult } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";
import { OrdinaryNFT } from "../typechain-types";
require("dotenv").config();

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, network } = hre;
  console.log(process.env.MNEMONIC);
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc-mumbai.maticvigil.com/"
  );

  const hdWallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC!);
  const wallet = hdWallet.connect(provider);

  const deployer = wallet.address;

  const { deploy } = deployments;

  const OrdinaryNFT: DeployResult = await deploy("OrdinaryNFT", {
    from: deployer,
    log: true,
  });

  console.log(`OrdinaryNFT deployed to: ${OrdinaryNFT.address}`);
};

export default func;
func.tags = ["All"];
