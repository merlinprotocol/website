import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },

  define: {
    'process.env.NETWORK': 'http://8.210.141.80:3000',

    'process.env.SETTLE_TOKEN_CONTRACT_ADDRESS': '0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1',
    'process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS': '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44',
    'process.env.WHITELIST_CONTRACT_ADDRESS': '0x67d269191c92Caf3cD7723F116c85e6E9bf55933',
    'process.env.HASHRATE_CONTRACT_ADDRESS': '0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E',
    'process.env.NFT_CONTRACT_ADDRESS': '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB',
  },

  theme: {
    '@primary-color': '#f1b90c',
    '@disabled-bg': '#907019',
    '@disabled-color': '#efefef',
    '@border-color-base': '#222222',
    '@height-base': '40px',

    '@card-head-color': '#999999',
    '@card-head-background': '#222122',
    '@card-background': '#222122',
    '@card-radius': '24px',

    '@label-color': '#999999',

    '@input-bg': '#161616',
    '@input-color': '#f1b90c',
    '@input-border-color': '#222122',
    '@input-height-base': '40px',
    '@input-addon-bg': '#161616',

    '@input-number-handler-bg': '#222222',

    '@table-bg': '#222122',
    '@table-header-bg': '#1a1a1a',
    '@table-header-color': '#f1b90c',
    '@table-border-radius-base': '24px',
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
      ],
    },
  ],
  fastRefresh: {},
});
