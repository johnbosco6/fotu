export default {
  title: 'Contact Form Submissions',
  name: 'contactSubmission',
  type: 'document',
  readOnly: true, // Make it read-only in the desk tool so editor cannot manually forge submissions easily
  fields: [
    {
      title: 'Sender Name',
      name: 'name',
      type: 'string'
    },
    {
      title: 'Email Address',
      name: 'email',
      type: 'string'
    },
    {
      title: 'Phone Number',
      name: 'phone',
      type: 'string'
    },
    {
      title: 'Service of Interest',
      name: 'service',
      type: 'string'
    },
    {
      title: 'Message',
      name: 'message',
      type: 'text'
    },
    {
      title: 'Submitted At',
      name: 'submittedAt',
      type: 'datetime'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      date: 'submittedAt'
    },
    prepare({ title, subtitle, date }) {
      const formattedDate = date ? new Date(date).toLocaleString() : '';
      return {
        title: title || 'Anonymous Submission',
        subtitle: `${subtitle || ''} | ${formattedDate}`
      };
    }
  }
}
