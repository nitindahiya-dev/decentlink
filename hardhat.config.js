require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.18",            // match your Registry.sol pragma
  networks: {
    // Example: Polygon Mumbai
    mumbai: {
      url: process.env.RPC_URL,   // e.g. https://polygon-mumbai.g.alchemy.com/v2/…
      accounts: [process.env.PRIVATE_KEY]
    },
    // add ethropsten, mainnet, etc. the same way
  },
};
