import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.NETWORK': 'http://localhost:8545',
    // 'process.env.NETWORK': 'https://data-seed-prebsc-1-s1.binance.org:8545',
    // 'process.env.NETWORK': 'https://rinkeby.infura.io/v3/63730a838c7f47058a73a67775d736c2',

    'process.env.WHITELIST_CONTRACT_ADDRESS': '0x9Fcca440F19c62CDF7f973eB6DDF218B15d4C71D',
    'process.env.HASHRATE_CONTRACT_ADDRESS': '0x3C1Cb427D20F15563aDa8C249E71db76d7183B6c',
    'process.env.NFT_CONTRACT_ADDRESS': '0x1343248Cbd4e291C6979e70a138f4c774e902561',
    'process.env.SETTLE_TOKEN_CONTRACT_ADDRESS': '0x683d9CDD3239E0e01E8dC6315fA50AD92aB71D2d',
    'process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS': '0x1c9fD50dF7a4f066884b58A05D91e4b55005876A',
    'process.env.SPLITTER_FACTORY': '0x01E21d7B8c39dc4C764c19b308Bd8b14B1ba139E',
  },
});
