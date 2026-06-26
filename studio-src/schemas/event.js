export default {
  title: 'Event',
  name: 'event',
  type: 'document',
  fields: [
    {
      title: 'Event Name',
      name: 'name',
      type: 'localizedString'
    },
    {
      title: 'Event Date',
      name: 'date',
      type: 'date'
    },
    {
      title: 'Location / Venue',
      name: 'location',
      type: 'localizedString'
    },
    {
      title: 'Description',
      name: 'description',
      type: 'localizedText'
    },
    {
      title: 'External Event Link',
      name: 'link',
      type: 'url'
    }
  ]
}
