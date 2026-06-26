export default {
  title: 'Research Area',
  name: 'researchArea',
  type: 'document',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'localizedString'
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96
      }
    },
    {
      title: 'Short Badge / Tag',
      name: 'badge',
      type: 'localizedString'
    },
    {
      title: 'Banner Image',
      name: 'bannerImage',
      type: 'image',
      options: { hotspot: true }
    },
    {
      title: 'Overview Title',
      name: 'overviewTitle',
      type: 'localizedString'
    },
    {
      title: 'Overview Text',
      name: 'overviewText',
      type: 'localizedBlock'
    },
    {
      title: 'Key Findings Title',
      name: 'findingsTitle',
      type: 'localizedString'
    },
    {
      title: 'Key Findings List',
      name: 'findings',
      type: 'array',
      of: [{ type: 'localizedString' }]
    }
  ]
}
