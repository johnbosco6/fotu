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
      title: 'Intro Description',
      name: 'introDescription',
      type: 'localizedText'
    },
    {
      title: 'Consulting Activities Section Title',
      name: 'activitiesTitle',
      type: 'localizedString'
    },
    {
      title: 'Academic Lecturing — Activity Title',
      name: 'lecturingTitle',
      type: 'localizedString'
    },
    {
      title: 'Academic Lecturing — Description',
      name: 'lecturingDesc',
      type: 'localizedText'
    },
    {
      title: 'Research Consultation — Activity Title',
      name: 'consultationTitle',
      type: 'localizedString'
    },
    {
      title: 'Research Consultation — Description',
      name: 'consultationDesc',
      type: 'localizedText'
    },
    {
      title: 'Policy Advisory — Activity Title',
      name: 'policyTitle',
      type: 'localizedString'
    },
    {
      title: 'Policy Advisory — Description',
      name: 'policyDesc',
      type: 'localizedText'
    },
    {
      title: 'Training Programs — Activity Title',
      name: 'trainingTitle',
      type: 'localizedString'
    },
    {
      title: 'Training Programs — Description',
      name: 'trainingDesc',
      type: 'localizedText'
    },
    {
      title: 'Previous Engagements Section Title',
      name: 'engagementsSectionTitle',
      type: 'localizedString'
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
    },
    {
      title: 'Request Collaboration Section Title',
      name: 'bookingTitle',
      type: 'localizedString'
    },
    {
      title: 'Request Collaboration Description',
      name: 'bookingDescription',
      type: 'localizedText'
    },
    {
      title: 'Request Booking Button Label',
      name: 'bookingButtonLabel',
      type: 'localizedString'
    }
  ]
}
