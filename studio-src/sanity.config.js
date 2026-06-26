import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './schema.js';

export default defineConfig({
  title: 'Dr. Fatoumata Sylla CMS',
  projectId: '1zncxuxn',
  dataset: 'production',
  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Website Content')
          .items([
            // Singleton: Homepage
            S.listItem()
              .title('Homepage')
              .id('homepage')
              .child(
                S.document()
                  .schemaType('homepage')
                  .documentId('homepage')
              ),
            // Singleton: About
            S.listItem()
              .title('About Page')
              .id('aboutPage')
              .child(
                S.document()
                  .schemaType('aboutPage')
                  .documentId('aboutPage')
              ),
            // Singleton: Consulting
            S.listItem()
              .title('Consulting Page')
              .id('consultingPage')
              .child(
                S.document()
                  .schemaType('consultingPage')
                  .documentId('consultingPage')
              ),
            // Singleton: Press Page
            S.listItem()
              .title('Press Page')
              .id('pressPage')
              .child(
                S.document()
                  .schemaType('pressPage')
                  .documentId('pressPage')
              ),
            // Singleton: Global Settings
            S.listItem()
              .title('Global Settings')
              .id('globalSettings')
              .child(
                S.document()
                  .schemaType('globalSettings')
                  .documentId('globalSettings')
              ),
            S.divider(),
            // Collections
            S.documentTypeListItem('researchArea').title('Research Areas'),
            S.documentTypeListItem('publication').title('Publications'),
            S.documentTypeListItem('blogPost').title('Blog / News Posts'),
            S.documentTypeListItem('event').title('Events / Lectures')
          ])
    })
  ],
  schema: {
    types: schemaTypes
  }
});
