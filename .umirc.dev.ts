import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    // 'process.env.NETWORK': 'http://localhost:8545',
    // 'process.env.NETWORK': 'https://data-seed-prebsc-1-s1.binance.org:8545',
    'process.env.NETWORK': 'https://rinkeby.infura.io/v3/63730a838c7f47058a73a67775d736c2',

    'process.env.WHITELIST_CONTRACT_ADDRESS': '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
    'process.env.HASHRATE_CONTRACT_ADDRESS': '0xC760EbA343782B966F1250b786145fD804a66891',
    'process.env.NFT_CONTRACT_ADDRESS': '0xc372ce70aec8cfea90a2196466c50f2dd59d2e38',
    'process.env.SETTLE_TOKEN_CONTRACT_ADDRESS': '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    'process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS': '0x321841Dd727c8545A4EdFC13C6b3629f6Ec18653',

    'process.env.SPLITTER_FACTORY': '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE',
  },
});
