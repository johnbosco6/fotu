/* main.js - Core functionality */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');
  const navClose = document.getElementById('nav-close');
  
  function openNav() {
    if (mainNav) {
      mainNav.classList.add('nav-open');
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
    }
  }

  function closeNav() {
    if (mainNav) {
      mainNav.classList.remove('nav-open');
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openNav);
  }

  if (navClose) {
    navClose.addEventListener('click', closeNav);
  }

  // Close nav when clicking a nav link (mobile)
  if (mainNav) {
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeNav);
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

  // Cookie Consent Banner (Dynamic Generation)
  initCookieBanner();
});

function initCookieBanner() {
  if (localStorage.getItem('cookie-consent')) return;

  const isFrench = window.location.pathname.includes('/fr/');
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.id = 'cookie-consent-banner';

  const titleText = isFrench ? 'Utilisation des cookies' : 'We use cookies';
  const descText = isFrench 
    ? 'Ce site utilise des cookies pour analyser le trafic, mémoriser vos préférences et garantir la meilleure expérience possible. Pour en savoir plus, consultez notre <a href="privacy.html">Politique de confidentialité</a>.'
    : 'This website uses cookies to analyze traffic, remember your preferences, and ensure you get the best experience on our site. To learn more, read our <a href="privacy.html">Privacy Policy</a>.';
  const acceptLabel = isFrench ? 'Tout accepter' : 'Accept All';
  const declineLabel = isFrench ? 'Refuser' : 'Decline';

  banner.innerHTML = `
    <div class="cookie-header">
      <svg class="cookie-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5z"></path>
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="16" cy="16" r="1"></circle>
        <circle cx="8" cy="14" r="1"></circle>
        <circle cx="10" cy="18" r="1"></circle>
      </svg>
      <h4 class="cookie-title">${titleText}</h4>
    </div>
    <p class="cookie-text">${descText}</p>
    <div class="cookie-actions">
      <button class="cookie-btn cookie-btn-decline" id="cookie-decline-btn">${declineLabel}</button>
      <button class="cookie-btn cookie-btn-accept" id="cookie-accept-btn">${acceptLabel}</button>
    </div>
  `;

  document.body.appendChild(banner);

  // Animate slide up
  setTimeout(() => {
    banner.classList.add('show');
  }, 1000);

  // Button triggers
  document.getElementById('cookie-accept-btn').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    hideBanner(banner);
  });

  document.getElementById('cookie-decline-btn').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'declined');
    hideBanner(banner);
  });
}

function hideBanner(banner) {
  banner.classList.remove('show');
  setTimeout(() => {
    banner.remove();
  }, 500);
}

// Public function to reset consent (for Cookie Preferences links)
window.resetCookieConsent = function() {
  localStorage.removeItem('cookie-consent');
  const existing = document.getElementById('cookie-consent-banner');
  if (existing) existing.remove();
  initCookieBanner();
};

