export default {
  title: 'Newsletter Signups',
  name: 'newsletterSubmission',
  type: 'document',
  readOnly: true,
  fields: [
    {
      title: 'First Name',
      name: 'firstName',
      type: 'string'
    },
    {
      title: 'Last Name',
      name: 'lastName',
      type: 'string'
    },
    {
      title: 'Email Address',
      name: 'email',
      type: 'string'
    },
    {
      title: 'Submitted At',
      name: 'submittedAt',
      type: 'datetime'
    }
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      date: 'submittedAt'
    },
    prepare({ firstName, lastName, email, date }) {
      const name = [firstName, lastName].filter(Boolean).join(' ') || 'Anonymous';
      const formattedDate = date ? new Date(date).toLocaleString() : '';
      return {
        title: name,
        subtitle: `${email || ''} | ${formattedDate}`
      };
    }
  }
}
