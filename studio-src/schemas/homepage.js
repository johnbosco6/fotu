export default {
  title: 'Homepage',
  name: 'homepage',
  type: 'document',
  // Standard singleton pattern settings in Sanity (configured in config/desk tool)
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
    }
  ]
}
