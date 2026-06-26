/* animations.js - Scroll animations via Intersection Observer */

document.addEventListener('DOMContentLoaded', () => {
  // Setup Intersection Observer for reveal animations
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOptions = {
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: "0px 0px -50px 0px"
  };
  
  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }
      
      // Add active class to trigger animation
      entry.target.classList.add('active');
      
      // Stop observing once revealed
      observer.unobserve(entry.target);
    });
  }, revealOptions);
  
  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });
});
