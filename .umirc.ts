import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
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
