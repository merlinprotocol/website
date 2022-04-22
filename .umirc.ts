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

  // define: {
  //   // 'process.env.NETWORK': 'http://8.210.141.80/rpc',
  //   'process.env.NETWORK': 'https://data-seed-prebsc-1-s1.binance.org:8545',

  //   'process.env.SETTLE_TOKEN_CONTRACT_ADDRESS': '0x2Aa0B2BB9FD0802bc0f5766E18D22daBcF505e1f',
  //   'process.env.PAYMENT_TOKEN_CONTRACT_ADDRESS': '0x44EA6A716fD53937e81AAf0d6CDBc3122C1e452A',
  //   'process.env.WHITELIST_CONTRACT_ADDRESS': '0x97254aef4CA139633596049594baae6A3281BbE0',
  //   'process.env.HASHRATE_CONTRACT_ADDRESS': '0x961cac2f6421c8432a3849268e619664b07a8469',
  //   'process.env.NFT_CONTRACT_ADDRESS': '0x95736847d4485BE1Ce9d485859A8f2DFe107934e',
  // },

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
