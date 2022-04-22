import { defineConfig } from 'umi';

export default defineConfig({
  outputPath: 'docs',
  // publicPath: '/website/',
  hash: true,

  favicon: '/favicon.png',

  analytics: {
    ga: 'G-CZFW2SDT2D',
  },

  nodeModulesTransform: {
    type: 'none',
  },

  metas: [
    {
      name: 'viewport',
      content: 'content="width=device-width, initial-scale=1.0, user-scalable=no"',
    },
  ],
  // proxy: {
  //   '/api/': {
  //     target: 'http://8.210.141.80:3000',
  //     changeOrigin: true,
  //     secure: false,
  //   },
  // },

  history: { type: 'hash' },

  define: {
    'process.env.NETWORK': 'http://8.210.141.80:8545/',

    'process.env.WHITELIST_CONTRACT_ADDRESS': '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    'process.env.HASHRATE_CONTRACT_ADDRESS': '0x712516e61C8B383dF4A63CFe83d7701Bce54B03e',
    'process.env.NFT_CONTRACT_ADDRESS': '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    'process.env.SETTLE_TOKEN_CONTRACT_ADDRESS': '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    'process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS': '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    'process.env.SPLITTER_FACTORY': '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    'process.env.VENDING_CONTRACT_ADDRESS': '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
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
        { path: '/', component: '@/pages/home', title: 'Merlin protocol' }, // 首页
        { path: '/launchpad/project', component: '@/pages/project', title: 'Project' }, // 项目页
        // { path: '/launchpad/:chainId/:contract', component: '@/pages/launchpadHistory', title: 'Launchpad' }, // 详情页
        { path: '/launchpad', component: '@/pages/launchpad', title: 'Launchpad' }, // 项目列表
        { path: '/mybuyhistory', component: '@/pages/myBuyHistory', title: 'Merlin protocol' }, // 我申购的项目

        { path: '/projects', component: '@/pages/projects' },
        { path: '/bind/:address', component: '@/pages/bind' },
        { path: '/settler', component: '@/pages/settler' },
        { path: '/history/:project', component: '@/pages/history' },
        { path: '/calendar', component: '@/pages/calendar' },
        { path: '/add-network', component: '@/pages/addNetwork' },
        { path: '*', component: '@/pages/404' },
      ],
    },
  ],
  fastRefresh: {},
});
