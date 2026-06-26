export default {
  title: 'Press & Media Page',
  name: 'pressPage',
  type: 'document',
  fields: [
    {
      title: 'Press Kit Description',
      name: 'pressDescription',
      type: 'localizedText'
    },
    {
      title: 'Press Kit Download Zip',
      name: 'pressKitFile',
      type: 'file'
    },
    {
      title: 'Media Inquiry Office / Contact Name',
      name: 'mediaContactName',
      type: 'string'
    },
    {
      title: 'Media Inquiry Contact Email',
      name: 'mediaContactEmail',
      type: 'string'
    },
    {
      title: 'Appearances & Contributions',
      name: 'appearances',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { title: 'Title', name: 'title', type: 'localizedString' },
            { title: 'Source / Date', name: 'meta', type: 'localizedString' },
            { title: 'Summary / Description', name: 'summary', type: 'localizedText' },
            { title: 'Action Link', name: 'link', type: 'url' },
            { title: 'Action Label (e.g. "Read Article", "Listen")', name: 'label', type: 'localizedString' }
          ]
        }
      ]
    }
  ]
}
