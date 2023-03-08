require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("hardhat-gas-reporter")
require("solidity-coverage")

const ALCHEMY = process.env.ALCHEMY || "";
const PK = process.env.PK || "";
const ETHERSCAN = process.env.ETHERSCAN || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: ALCHEMY,
      accounts: [`0x${PK}`],
      chainId: 5,
      blockConfirmations: 6
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    }
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9"
      }
    ]
  },
  gasReporter: {
    enabled: true,
  },
};