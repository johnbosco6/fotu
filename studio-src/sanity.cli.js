import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: '1zncxuxn',
    dataset: 'production'
  },
  project: {
    basePath: '/studio'
  }
});
