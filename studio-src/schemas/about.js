export default {
  title: 'About Page',
  name: 'aboutPage',
  type: 'document',
  fields: [
    {
      title: 'Page Title',
      name: 'pageTitle',
      type: 'localizedString'
    },
    {
      title: 'Page Subtitle',
      name: 'pageSubtitle',
      type: 'localizedString'
    },
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
      title: 'CV Download Button Label',
      name: 'cvButtonLabel',
      type: 'localizedString'
    },
    {
      title: 'Quick Facts',
      name: 'quickFacts',
      type: 'object',
      fields: [
        { title: 'Position Label', name: 'positionLabel', type: 'localizedString' },
        { title: 'Position', name: 'position', type: 'localizedString' },
        { title: 'Specialization Label', name: 'specializationLabel', type: 'localizedString' },
        { title: 'Specialization', name: 'specialization', type: 'localizedString' },
        { title: 'Languages Label', name: 'languagesLabel', type: 'localizedString' },
        { title: 'Languages', name: 'languages', type: 'localizedString' }
      ]
    },
    {
      title: 'CV Section Title',
      name: 'cvTitle',
      type: 'localizedString'
    },
    {
      title: 'CV Section Description',
      name: 'cvDescription',
      type: 'localizedText'
    },
    {
      title: 'Academic & Professional Journey Section Title',
      name: 'journeyTitle',
      type: 'localizedString'
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
