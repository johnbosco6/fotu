export default {
  title: 'Consulting Page',
  name: 'consultingPage',
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
      title: 'Academic Lecturing Description',
      name: 'lecturingDesc',
      type: 'localizedText'
    },
    {
      title: 'Research Consultation Description',
      name: 'consultationDesc',
      type: 'localizedText'
    },
    {
      title: 'Policy Advisory Description',
      name: 'policyDesc',
      type: 'localizedText'
    },
    {
      title: 'Training Programs Description',
      name: 'trainingDesc',
      type: 'localizedText'
    },
    {
      title: 'Previous Engagements',
      name: 'engagements',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { title: 'Engagement Year / Date', name: 'date', type: 'string' },
            { title: 'Role / Title', name: 'role', type: 'localizedString' },
            { title: 'Institution / Client', name: 'institution', type: 'localizedString' }
          ]
        }
      ]
    }
  ]
}
