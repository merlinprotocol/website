import Web3 from 'web3';

export default {
  networks: {
    hardhat: {
      chainId: '0x7a69',
      provider: new Web3(Web3.givenProvider || 'http://8.210.141.80:8545/'),
      wbtc: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      usdt: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      vending: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
    },
    'bsc-testnet': {
      chainId: '0x61',
      provider: new Web3(Web3.givenProvider || 'https://data-seed-prebsc-1-s1.binance.org:8545'),
      wbtc: '0x5aD52016b7935e8376C89A86E1F25456d6D06371',
      usdt: '0x877b939CE6467C475f6e6300793B363E540a52Ef',
      vending: '0x6527c0b3A19d1222eade8Db440dad6c35E15C6Ac',
    },
  },
};
