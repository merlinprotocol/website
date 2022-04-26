import Web3 from 'web3';

export default {
  network: {
    31337: {
      //   provider: new Web3.providers.HttpProvider('http://localhost:8545'),
      provider: new Web3(Web3.givenProvider || 'http://localhost:8545'),
      wbtc: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      usdt: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      vending: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
    },
    97: {
      provider: new Web3(Web3.givenProvider || 'https://data-seed-prebsc-1-s1.binance.org:8545'),
      wbtc: '0x5aD52016b7935e8376C89A86E1F25456d6D06371',
      usdt: '0x877b939CE6467C475f6e6300793B363E540a52Ef',
      vending: '0x6527c0b3A19d1222eade8Db440dad6c35E15C6Ac',
    },
  },
};
