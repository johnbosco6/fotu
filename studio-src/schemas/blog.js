export default {
  title: 'Blog / News',
  name: 'blogPost',
  type: 'document',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'localizedString'
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96
      }
    },
    {
      title: 'Published Date',
      name: 'date',
      type: 'date'
    },
    {
      title: 'Category',
      name: 'category',
      type: 'localizedString'
    },
    {
      title: 'Cover Image',
      name: 'image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      title: 'Excerpt',
      name: 'excerpt',
      type: 'localizedText'
    },
    {
      title: 'Content',
      name: 'content',
      type: 'localizedBlock'
    }
  ]
}
