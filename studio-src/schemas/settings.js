export default {
  title: 'Settings / Navigation / Global',
  name: 'globalSettings',
  type: 'document',
  fields: [
    {
      title: 'Site Title',
      name: 'siteTitle',
      type: 'string'
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
