import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/layouts/basic',
      routes: [
        { path: '/', redirect: '/projects' },
        { path: '/projects', component: '@/pages/projects' },
        { path: '/project/:address', component: '@/pages/project' },
      ],
    },
  ],
  fastRefresh: {},
});
