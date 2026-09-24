export default {
  title: 'Homepage',
  name: 'homepage',
  type: 'document',
  fields: [
    {
      title: 'Hero Title',
      name: 'heroTitle',
      type: 'localizedString'
    },
    {
      title: 'Hero Subtitle',
      name: 'heroSubtitle',
      type: 'localizedString'
    },
    {
      title: 'Profile Image',
      name: 'profileImage',
      type: 'image',
      options: { hotspot: true }
    },
    {
      title: 'Introduction Title',
      name: 'introTitle',
      type: 'localizedString'
    },
    {
      title: 'Introduction Description',
      name: 'introDescription',
      type: 'localizedText'
    },
    {
      title: 'Research Section Title',
      name: 'researchTitle',
      type: 'localizedString'
    },
    {
      title: 'Publications Section Title',
      name: 'publicationsTitle',
      type: 'localizedString'
    },
    {
      title: 'Events Section Title',
      name: 'eventsTitle',
      type: 'localizedString'
    }
  ]
}
