import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import { HardhatUserConfig } from "hardhat/config";
import {
  HardhatNetworkAccountsConfig,
  HardhatNetworkConfig,
} from "hardhat/types";

import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

/**
 * Update block number when changing networks.
 */
const ETH_FORK_BLOCK_NUMBER = 20730356;
const MNEMONIC = process.env.MNEMONIC as string;
const ALCHEMY_API_KEY = process.env.ALCHEMY_KEY as string;
const ALCHEMY_KEY_POLYGON = process.env.ALCHEMY_KEY_POLYGON as string;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      // forking: {
      //   url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      //   blockNumber: ETH_FORK_BLOCK_NUMBER,
      // },
      // accounts: { mnemonic: MNEMONIC },
      // chainId: 31337,
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemyapi.io/v2/${ALCHEMY_KEY_POLYGON}`,
      accounts: { mnemonic: MNEMONIC },
      chainId: 137,
      timeout: 100000,
    },
    mumbai_testnet: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: { mnemonic: MNEMONIC },
      chainId: 80001,
      timeout: 100000,
    },
    // goerli: {
    //   url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
    //   gas: 21000000,
    //   gasPrice: 800000,
    //   accounts: { mnemonic: MNEMONIC },
    //   timeout: 100000,
    // },
  },
};

export default config;
