export default {
  title: 'About Page',
  name: 'aboutPage',
  type: 'document',
  fields: [
    {
      title: 'Biography Title',
      name: 'bioTitle',
      type: 'localizedString'
    },
    {
      title: 'Biography Content',
      name: 'bioContent',
      type: 'localizedBlock'
    },
    {
      title: 'Profile Image',
      name: 'profileImage',
      type: 'image',
      options: { hotspot: true }
    },
    {
      title: 'CV File Download',
      name: 'cvFile',
      type: 'file'
    },
    {
      title: 'Quick Facts',
      name: 'quickFacts',
      type: 'object',
      fields: [
        { title: 'Position', name: 'position', type: 'localizedString' },
        { title: 'Specialization', name: 'specialization', type: 'localizedString' },
        { title: 'Languages', name: 'languages', type: 'localizedString' }
      ]
    },
    {
      title: 'Timeline / Experience',
      name: 'timeline',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { title: 'Years', name: 'years', type: 'string' },
            { title: 'Role Title', name: 'role', type: 'localizedString' },
            { title: 'Institution / Location', name: 'institution', type: 'localizedString' },
            { title: 'Details', name: 'details', type: 'localizedText' }
          ]
        }
      ]
    }
  ]
}
