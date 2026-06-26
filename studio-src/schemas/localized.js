export const localizedString = {
  title: 'Localized String',
  name: 'localizedString',
  type: 'object',
  fields: [
    { title: 'English', name: 'en', type: 'string' },
    { title: 'French', name: 'fr', type: 'string' }
  ]
};

export const localizedText = {
  title: 'Localized Text',
  name: 'localizedText',
  type: 'object',
  fields: [
    { title: 'English', name: 'en', type: 'text', rows: 4 },
    { title: 'French', name: 'fr', type: 'text', rows: 4 }
  ]
};

export const localizedBlock = {
  title: 'Localized Rich Text',
  name: 'localizedBlock',
  type: 'object',
  fields: [
    {
      title: 'English',
      name: 'en',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      title: 'French',
      name: 'fr',
      type: 'array',
      of: [{ type: 'block' }]
    }
  ]
};
