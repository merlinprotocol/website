import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.NETWORK': 'http://8.210.141.80:4000',
    // 'process.env.NETWORK': 'https://data-seed-prebsc-1-s1.binance.org:8545',
    // 'process.env.NETWORK': 'https://rinkeby.infura.io/v3/63730a838c7f47058a73a67775d736c2',

    'process.env.WHITELIST_CONTRACT_ADDRESS': '0xde2Bd2ffEA002b8E84ADeA96e5976aF664115E2c',
    'process.env.HASHRATE_CONTRACT_ADDRESS': '0x870526b7973b56163a6997bB7C886F5E4EA53638',
    'process.env.NFT_CONTRACT_ADDRESS': '0xD49a0e9A4CD5979aE36840f542D2d7f02C4817Be',
    'process.env.SETTLE_TOKEN_CONTRACT_ADDRESS': '0x683d9CDD3239E0e01E8dC6315fA50AD92aB71D2d',
    'process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS': '0x96F3Ce39Ad2BfDCf92C0F6E2C2CAbF83874660Fc',
    'process.env.SPLITTER_FACTORY': '0x01E21d7B8c39dc4C764c19b308Bd8b14B1ba139E',
    'process.env.VENDING_CONTRACT_ADDRESS': '0xB377a2EeD7566Ac9fCb0BA673604F9BF875e2Bab',
  },
});
