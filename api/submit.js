// api/submit.js - Handles contact form & newsletter submissions securely

module.exports = async (req, res) => {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { formType, ...payload } = req.body || {};

    if (!formType) {
      return res.status(400).json({ success: false, error: 'Missing formType property' });
    }

    // 2. Validate payload and format document mutation
    let doc = {};
    const timestamp = new Date().toISOString();

    if (formType === 'contact') {
      const { name, email, phone, service, message } = payload;
      if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'Required fields missing for contact form' });
      }
      doc = {
        _type: 'contactSubmission',
        name,
        email,
        phone: phone || '',
        service: service || '',
        message,
        submittedAt: timestamp
      };
    } else if (formType === 'newsletter') {
      const { firstName, lastName, email } = payload;
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email address is required for newsletter signup' });
      }
      doc = {
        _type: 'newsletterSubmission',
        firstName: firstName || '',
        lastName: lastName || '',
        email,
        submittedAt: timestamp
      };
    } else {
      return res.status(400).json({ success: false, error: `Unknown formType: ${formType}` });
    }

    // 3. Verify Sanity token is present
    const writeToken = process.env.SANITY_WRITE_TOKEN;
    const projectId = '1zncxuxn';
    const dataset = 'production';

    if (!writeToken) {
      console.warn('WARNING: SANITY_WRITE_TOKEN environment variable is not defined. Simulating successful write.');
      return res.status(200).json({
        success: true,
        simulated: true,
        message: 'Form submitted successfully (simulation mode, no token configured)'
      });
    }

    // 4. Send mutation to Sanity HTTP API
    const response = await fetch(`https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${writeToken}`
      },
      body: JSON.stringify({
        mutations: [
          {
            create: doc
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Sanity Mutation API error:', data);
      return res.status(response.status).json({
        success: false,
        error: data.error?.message || 'Failed to record submission in CMS'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Submission successfully recorded in Sanity',
      documentId: data.results?.[0]?.id
    });

  } catch (err) {
    console.error('Form submission exception:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};
