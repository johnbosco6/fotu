export default {
  title: 'Contact Page',
  name: 'contactPage',
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
      title: 'Connect Section Title',
      name: 'connectTitle',
      type: 'localizedString'
    },
    {
      title: 'Connect Description',
      name: 'connectDescription',
      type: 'localizedText'
    },
    {
      title: 'Form Title',
      name: 'formTitle',
      type: 'localizedString'
    },
    {
      title: 'Submit Button Label',
      name: 'submitButtonLabel',
      type: 'localizedString'
    },
    {
      title: 'Social Section Title',
      name: 'socialTitle',
      type: 'localizedString'
    },
    {
      title: 'Service Dropdown Options',
      name: 'serviceOptions',
      description: 'Options shown in the "Services Interested In" dropdown. The value field is used internally.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { title: 'Option Value (internal)', name: 'value', type: 'string' },
            { title: 'Option Label', name: 'label', type: 'localizedString' }
          ]
        }
      ]
    }
  ]
}
