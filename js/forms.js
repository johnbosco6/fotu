/* forms.js - Form validation and submission logic */

document.addEventListener('DOMContentLoaded', () => {
  // Newsletter Form
  const newsletterForm = document.getElementById('newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Placeholder for actual submission (e.g., Mailchimp, Formspree)
      const btn = newsletterForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      
      btn.textContent = 'Subscribing...';
      btn.disabled = true;
      
      // Simulate network request
      setTimeout(() => {
        btn.textContent = 'Subscribed!';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-success');
        btn.style.backgroundColor = 'var(--color-success)';
        newsletterForm.reset();
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.classList.add('btn-primary');
          btn.classList.remove('btn-success');
          btn.style.backgroundColor = '';
        }, 3000);
      }, 1500);
    });
  }

  // Contact Form
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Placeholder for actual submission (e.g., Formspree, EmailJS)
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      
      btn.textContent = 'Sending...';
      btn.disabled = true;
      
      // Simulate network request
      setTimeout(() => {
        btn.textContent = 'Message Sent Successfully!';
        btn.style.backgroundColor = 'var(--color-success)';
        btn.style.borderColor = 'var(--color-success)';
        contactForm.reset();
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.backgroundColor = '';
          btn.style.borderColor = '';
        }, 4000);
      }, 1500);
    });
  }
});
