import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },

  history: { type: 'hash' },

  define: {
    'process.env.NETWORK': 'http://8.210.141.80/rpc',

    'process.env.SETTLE_TOKEN_CONTRACT_ADDRESS': '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    'process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS': '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    'process.env.WHITELIST_CONTRACT_ADDRESS': '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    'process.env.HASHRATE_CONTRACT_ADDRESS': '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
    'process.env.NFT_CONTRACT_ADDRESS': '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
  },

  theme: {
    '@primary-color': 'rgb(120,120,166)',
    //   '@disabled-bg': '#907019',
    //   '@disabled-color': '#efefef',
    //   '@border-color-base': '#222222',
    //   '@height-base': '40px',

    '@card-head-color': '#fff',
    '@card-head-background': 'rgb(33, 35, 50)',
    '@card-background': 'rgb(33, 35, 50)',
    '@card-radius': '24px',

    '@label-color': 'rgb(149, 151, 193)',

    '@input-bg': 'rgb(149, 151, 193)',
    '@input-color': '#fff',
    '@input-border-color': 'rgb(33, 35, 50)',
    '@input-addon-bg': 'rgb(149, 151, 193)',

    //   '@input-number-handler-bg': '#222222',

    //   '@table-bg': '#222122',
    '@table-header-bg': 'rgb(33, 35, 50)',
    //   '@table-header-color': '#f1b90c',
    //   '@table-border-radius-base': '24px',
  },

  routes: [
    {
      path: '/',
      component: '@/layouts/basic',
      routes: [
        { path: '/', redirect: '/projects' },
        { path: '/projects', component: '@/pages/projects' },
        { path: '/bind/:address', component: '@/pages/bind' },
        { path: '/settler', component: '@/pages/settler' },
        { path: '/history/:project', component: '@/pages/history' },
        { path: '/calendar', component: '@/pages/calendar' },
        { path: '/add-network', component: '@/pages/addNetwork' },
      ],
    },
  ],
  fastRefresh: {},
});
