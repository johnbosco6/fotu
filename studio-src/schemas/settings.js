export default {
  title: 'Settings / Navigation / Global',
  name: 'globalSettings',
  type: 'document',
  fields: [
    {
      title: 'Site Title',
      name: 'siteTitle',
      type: 'localizedString'
    },
    {
      title: 'Header Navigation Menu Items',
      name: 'navItems',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { title: 'Label', name: 'label', type: 'localizedString' },
            { title: 'URL Link', name: 'url', type: 'string' }
          ]
        }
      ]
    },
    {
      title: 'Footer Bio / Tagline',
      name: 'footerBio',
      type: 'localizedText'
    },
    {
      title: 'Footer Navigation Links',
      name: 'footerNavLinks',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { title: 'Label', name: 'label', type: 'localizedString' },
            { title: 'URL Link', name: 'url', type: 'string' }
          ]
        }
      ]
    },
    {
      title: 'Footer Research Links',
      name: 'footerResearchLinks',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { title: 'Label', name: 'label', type: 'localizedString' },
            { title: 'URL Link', name: 'url', type: 'string' }
          ]
        }
      ]
    },
    {
      title: 'Newsletter Section Title',
      name: 'newsletterTitle',
      type: 'localizedString'
    },
    {
      title: 'Newsletter Section Subtitle',
      name: 'newsletterSubtitle',
      type: 'localizedText'
    },
    {
      title: 'LinkedIn Link',
      name: 'linkedin',
      type: 'url'
    },
    {
      title: 'ORCID Link',
      name: 'orcid',
      type: 'url'
    },
    {
      title: 'Google Scholar Link',
      name: 'scholar',
      type: 'url'
    },
    {
      title: 'Instagram Link',
      name: 'instagram',
      type: 'url'
    },
    {
      title: 'Contact Email',
      name: 'contactEmail',
      type: 'string'
    },
    {
      title: 'Affiliations Logos & Links',
      name: 'affiliations',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { title: 'Affiliation Name', name: 'name', type: 'string' },
            { title: 'Website Link', name: 'link', type: 'url' },
            { title: 'Logo Image', name: 'logo', type: 'image' }
          ]
        }
      ]
    }
  ]
}
