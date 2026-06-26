/* main.js - Core functionality */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');
  
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('nav-open');
      mobileToggle.textContent = mainNav.classList.contains('nav-open') ? '✕' : '☰';
    });
  }

  // Sticky Header
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Search Modal Toggle (Placeholder for full search implementation)
  const searchToggle = document.getElementById('search-toggle');
  const searchModal = document.getElementById('search-modal');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');

  if (searchToggle && searchModal) {
    searchToggle.addEventListener('click', () => {
      searchModal.classList.add('active');
      if (searchInput) setTimeout(() => searchInput.focus(), 100);
    });
  }

  if (searchClose && searchModal) {
    searchClose.addEventListener('click', () => {
      searchModal.classList.remove('active');
    });
  }
  
  // Close search on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
      searchModal.classList.remove('active');
    }
  });

  // Google Translate Init
  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'es,de,it,pt,ar,zh-CN,ru', // Add as needed
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
  };

  // Add Google Translate Script
  const gtScript = document.createElement('script');
  gtScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.body.appendChild(gtScript);
});
