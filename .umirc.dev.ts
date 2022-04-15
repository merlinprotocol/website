import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    // 'process.env.NETWORK': 'http://8.210.141.80:4000',
    'process.env.NETWORK': 'http://127.0.0.1:8545',
    // 'process.env.NETWORK': 'https://data-seed-prebsc-1-s1.binance.org:8545',
    // 'process.env.NETWORK': 'https://rinkeby.infura.io/v3/63730a838c7f47058a73a67775d736c2',

    'process.env.WHITELIST_CONTRACT_ADDRESS': '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    'process.env.HASHRATE_CONTRACT_ADDRESS': '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    'process.env.NFT_CONTRACT_ADDRESS': '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    'process.env.SETTLE_TOKEN_CONTRACT_ADDRESS': '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    'process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS': '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    'process.env.SPLITTER_FACTORY': '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    'process.env.VENDING_CONTRACT_ADDRESS': '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
  },

  proxy: {
    '/api/': {
      target: 'http://api.merlinprotocol.org',
      changeOrigin: true,
      secure: false,
    },
  },
});
