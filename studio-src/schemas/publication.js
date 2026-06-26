export default {
  title: 'Publication',
  name: 'publication',
  type: 'document',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'localizedString'
    },
    {
      title: 'Authors',
      name: 'authors',
      type: 'string'
    },
    {
      title: 'Journal / Publisher',
      name: 'journal',
      type: 'string'
    },
    {
      title: 'Year',
      name: 'year',
      type: 'number'
    },
    {
      title: 'DOI Link',
      name: 'doi',
      type: 'url'
    },
    {
      title: 'PDF File',
      name: 'pdfFile',
      type: 'file'
    },
    {
      title: 'Related Research Area',
      name: 'researchArea',
      type: 'reference',
      to: [{ type: 'researchArea' }]
    }
  ]
}
