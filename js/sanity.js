/* sanity.js - Client integration for Sanity CMS without external library dependencies */

const SANITY_PROJECT_ID = '1zncxuxn';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = 'v2021-10-21';

// Automatically detect language based on URL path
const isFrench = window.location.pathname.includes('/fr/');
const lang = isFrench ? 'fr' : 'en';

// Helper to resolve Sanity Image asset references to CDN URLs
function urlFor(source) {
  if (!source || !source.asset || !source.asset._ref) return '';
  const ref = source.asset._ref;
  // Format: image-[id]-[dimensions]-[extension]
  const parts = ref.split('-');
  if (parts.length < 4) return '';
  const id = parts[1];
  const dimensions = parts[2];
  const ext = parts[3];
  return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${ext}`;
}

// Helper to resolve Sanity File asset references to CDN URLs
function fileUrlFor(source) {
  if (!source || !source.asset || !source.asset._ref) return '';
  const ref = source.asset._ref;
  // Format: file-[id]-[extension]
  const parts = ref.split('-');
  if (parts.length < 3) return '';
  const id = parts[1];
  const ext = parts[2];
  return `https://cdn.sanity.io/files/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}.${ext}`;
}

// Simple Portable Text to HTML converter for biography/paragraphs
function portableTextToHTML(blocks) {
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks.map(block => {
    if (block._type !== 'block' || !block.children) return '';
    const content = block.children.map(span => {
      let text = span.text || '';
      // Escape HTML characters
      text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      if (span.marks && span.marks.length > 0) {
        if (span.marks.includes('strong')) text = `<strong>${text}</strong>`;
        if (span.marks.includes('em')) text = `<em>${text}</em>`;
      }
      return text;
    }).join('');
    return `<p>${content}</p>`;
  }).join('');
}

// General fetch function for GROQ queries
async function fetchFromSanity(query) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodedQuery}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch from Sanity');
    const json = await response.json();
    return json.result;
  } catch (error) {
    console.warn('Sanity CMS connection failed or dataset is empty. Falling back to local template values.', error);
    return null;
  }
}

// Global settings loader: footer, social links, logo affiliations
async function loadGlobalSettings() {
  const query = `*[_type == "globalSettings"][0]`;
  const settings = await fetchFromSanity(query);
  if (!settings) return;

  // Social Links (using robust selectors matching both URL substring and aria-labels)
  const linkedinElems = document.querySelectorAll('a[href*="linkedin.com"], a[aria-label="LinkedIn"], a[aria-label="Linkedin"]');
  const orcidElems = document.querySelectorAll('a[href*="orcid.org"], a[aria-label="ORCID"], a[aria-label="ORCiD"]');
  const scholarElems = document.querySelectorAll('a[href*="scholar.google"], a[aria-label="Google Scholar"]');
  const instagramElems = document.querySelectorAll('a[href*="instagram.com"], a[aria-label="Instagram"]');

  if (settings.linkedin) linkedinElems.forEach(el => el.href = settings.linkedin);
  if (settings.orcid) orcidElems.forEach(el => el.href = settings.orcid);
  if (settings.scholar) scholarElems.forEach(el => el.href = settings.scholar);
  if (settings.instagram) instagramElems.forEach(el => el.href = settings.instagram);

  // Email inquiry
  if (settings.contactEmail) {
    const emailLink = document.querySelector('a[href^="mailto:contact@"]');
    if (emailLink) {
      emailLink.href = `mailto:${settings.contactEmail}`;
      emailLink.textContent = settings.contactEmail;
    }
  }

  // Affiliations inside Footer (with enlarged size)
  if (settings.affiliations && settings.affiliations.length > 0) {
    const containers = document.querySelectorAll('.affiliations-container');
    containers.forEach(container => {
      container.innerHTML = settings.affiliations.map(aff => `
        <a href="${aff.link || '#'}" target="_blank" rel="noopener noreferrer" class="hover-lift" style="display: inline-block;">
          <img src="${urlFor(aff.logo)}" alt="${aff.name || 'Affiliation'}" style="height: 85px; max-width: 100%; object-fit: contain; background: white; padding: var(--space-2) var(--space-4); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid var(--color-border);">
        </a>
      `).join('');
    });
  }
}

// Homepage specific data loader
async function loadHomepage() {
  const query = `*[_type == "homepage"][0]`;
  const data = await fetchFromSanity(query);
  if (!data) return;

  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroImage = document.querySelector('.profile-img');
  const introTitle = document.querySelector('.section h2');
  const introDesc = document.querySelector('.section p[style*="max-width"]');

  if (heroTitle && data.heroTitle?.[lang]) heroTitle.textContent = data.heroTitle[lang];
  if (heroSubtitle && data.heroSubtitle?.[lang]) heroSubtitle.textContent = data.heroSubtitle[lang];
  if (heroImage && data.profileImage) heroImage.src = urlFor(data.profileImage);
  if (introTitle && data.introTitle?.[lang]) introTitle.textContent = data.introTitle[lang];
  if (introDesc && data.introDescription?.[lang]) introDesc.textContent = data.introDescription[lang];

  // Load latest publications on homepage
  const homePubList = document.getElementById('home-publications-list');
  if (homePubList) {
    const pubQuery = `*[_type == "publication"] | order(year desc)[0...3]`;
    const pubs = await fetchFromSanity(pubQuery);
    if (pubs && pubs.length > 0) {
      homePubList.innerHTML = pubs.map(pub => `
        <li class="publication-item">
          <div class="pub-title">${pub.title?.[lang] || ''}</div>
          <div class="pub-authors">${pub.authors || ''}</div>
          <div class="pub-journal">${pub.journal || ''}, ${pub.year || ''}</div>
          <div class="pub-links">
            ${pub.pdfFile ? `<a href="${fileUrlFor(pub.pdfFile)}" target="_blank">${isFrench ? 'Télécharger PDF' : 'Read PDF'}</a>` : ''}
            ${pub.pdfFile && pub.doi ? ' | ' : ''}
            ${pub.doi ? `<a href="${pub.doi}" target="_blank">DOI Link</a>` : ''}
          </div>
        </li>
      `).join('');
    }
  }

  // Load upcoming events on homepage
  const homeEventsList = document.getElementById('home-events-list');
  if (homeEventsList) {
    const eventQuery = `*[_type == "event" && date >= now()] | order(date asc)[0...3]`;
    const events = await fetchFromSanity(eventQuery);
    if (events && events.length > 0) {
      homeEventsList.innerHTML = events.map(evt => {
        const eventDate = new Date(evt.date);
        const day = eventDate.getDate().toString().padStart(2, '0');
        const month = eventDate.toLocaleString('default', { month: 'short' });
        return `
          <div class="card mb-4" style="flex-direction: row; align-items: center; padding: 1rem;">
            <div style="flex-shrink: 0; background: var(--color-bg-alt); padding: 1rem; border-radius: 8px; text-align: center; margin-right: 1rem;">
              <span style="display: block; font-weight: 700; color: var(--color-primary); font-size: 1.5rem;">${day}</span>
              <span style="display: block; text-transform: uppercase; font-size: 0.8rem;">${month}</span>
            </div>
            <div>
              <h4 style="margin: 0;">${evt.name?.[lang] || ''}</h4>
              <p style="margin: 0; color: var(--color-text-muted); font-size: 0.9rem;">${evt.location?.[lang] || ''}</p>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// About Page specific data loader
async function loadAboutPage() {
  const query = `*[_type == "aboutPage"][0]`;
  const data = await fetchFromSanity(query);
  if (!data) return;

  // Biography content (new layout uses #about-bio-content)
  const bioContainer = document.getElementById('about-bio-content');
  const profileImage = document.querySelector('.about-image');
  const cvLink = document.getElementById('cv-download-link');

  if (bioContainer && data.bioContent?.[lang]) {
    const titleHTML = `<h2>${data.bioTitle?.[lang] || (isFrench ? 'Biographie professionnelle' : 'Professional Biography')}</h2>`;
    const blocksHTML = portableTextToHTML(data.bioContent[lang]);
    bioContainer.innerHTML = titleHTML + blocksHTML;
  } else if (bioContainer && data.bioTitle?.[lang]) {
    const h2 = bioContainer.querySelector('h2');
    if (h2) h2.textContent = data.bioTitle[lang];
  }

  if (profileImage && data.profileImage) profileImage.src = urlFor(data.profileImage);

  // CV File download
  if (cvLink && data.cvFile) {
    cvLink.href = fileUrlFor(data.cvFile);
  }

  // Quick Facts (new layout uses individual #fact-* IDs)
  if (data.quickFacts) {
    const posEl = document.getElementById('fact-position');
    const specEl = document.getElementById('fact-specialization');
    const langEl = document.getElementById('fact-languages');
    if (posEl && data.quickFacts.position?.[lang]) posEl.textContent = data.quickFacts.position[lang];
    if (specEl && data.quickFacts.specialization?.[lang]) specEl.textContent = data.quickFacts.specialization[lang];
    if (langEl && data.quickFacts.languages?.[lang]) langEl.textContent = data.quickFacts.languages[lang];
  }

  // Timeline
  if (data.timeline && data.timeline.length > 0) {
    const timelineContainer = document.querySelector('.timeline');
    if (timelineContainer) {
      timelineContainer.innerHTML = data.timeline.map(item => `
        <div class="timeline-item">
          <div class="timeline-date">${item.years || ''}</div>
          <h4>${item.role?.[lang] || ''}</h4>
          <p>${item.institution?.[lang] || ''}</p>
          ${item.details?.[lang] ? `<p class="text-muted" style="margin-top: 0.5rem; font-size: 0.95rem;">${item.details[lang]}</p>` : ''}
        </div>
      `).join('');
    }
  }
}

// Research Page & Subpages loader
async function loadResearchPages() {
  const isFgmPage = window.location.pathname.includes('research-fgm');
  const isFibroidsPage = window.location.pathname.includes('research-fibroids');

  // Check if cards linking to research subpages are present in the DOM (e.g. homepage or research overview page)
  const cardLinks = document.querySelectorAll('a[href*="research-fgm"], a[href*="research-fibroids"]');
  if (cardLinks.length > 0) {
    const query = `*[_type == "researchArea"]`;
    const areas = await fetchFromSanity(query);
    if (areas && areas.length > 0) {
      areas.forEach(area => {
        const areaSlug = area.slug?.current || '';
        // Find all links referencing this area's slug
        const matches = document.querySelectorAll(`a[href*="${areaSlug}"]`);
        matches.forEach(cardLink => {
          const card = cardLink.closest('.card');
          if (card) {
            const title = card.querySelector('.card-title');
            const desc = card.querySelector('.card-text');
            const badge = card.querySelector('.badge');
            const img = card.querySelector('.card-image');

            if (title && area.title?.[lang]) title.textContent = area.title[lang];
            if (badge && area.badge?.[lang]) badge.textContent = area.badge[lang];
            if (desc && area.shortDescription?.[lang]) desc.textContent = area.shortDescription[lang];
            if (img && area.bannerImage) img.src = urlFor(area.bannerImage);
          }
        });
      });
    }
  }

  if (isFgmPage || isFibroidsPage) {
    const slug = isFgmPage ? 'fgm' : 'fibroids';
    const query = `*[_type == "researchArea" && slug.current match "*${slug}*"][0]`;
    const data = await fetchFromSanity(query);
    if (!data) return;

    const titleEl = document.querySelector('.page-title');
    const subtitleEl = document.querySelector('.page-subtitle');
    const imgEl = document.querySelector('.about-image');
    const overviewTitleEl = document.querySelector('.reveal h2');
    const overviewTextEl = document.querySelector('.reveal h2 + p');
    const findingsEl = document.querySelector('.reveal ul');

    if (titleEl && data.title?.[lang]) titleEl.textContent = data.title[lang];
    if (subtitleEl && data.badge?.[lang]) subtitleEl.textContent = data.badge[lang];
    if (imgEl && data.bannerImage) imgEl.src = urlFor(data.bannerImage);
    if (overviewTitleEl && data.overviewTitle?.[lang]) overviewTitleEl.textContent = data.overviewTitle[lang];
    
    if (overviewTextEl && data.overviewText?.[lang]) {
      const parent = overviewTextEl.parentElement;
      if (parent) {
        const titleHTML = `<h2>${data.overviewTitle?.[lang] || 'Project Overview'}</h2>`;
        const blocksHTML = portableTextToHTML(data.overviewText[lang]);
        const btnHTML = parent.querySelector('.btn') ? parent.querySelector('.btn').outerHTML : '';
        parent.innerHTML = titleHTML + blocksHTML + btnHTML;
      }
    }

    if (findingsEl && data.findings && data.findings.length > 0) {
      const findingsTitleEl = document.querySelector('.reveal h3');
      if (findingsTitleEl && data.findingsTitle?.[lang]) {
        findingsTitleEl.textContent = data.findingsTitle[lang];
      }
      findingsEl.innerHTML = data.findings.map(finding => `
        <li>${finding[lang] || ''}</li>
      `).join('');
    }

    // Load related publications
    const pubQuery = `*[_type == "publication" && references('${data._id}')] | order(year desc)`;
    const relatedPubs = await fetchFromSanity(pubQuery);
    if (relatedPubs && relatedPubs.length > 0) {
      // Inject "Related Publications" section
      let pubSection = document.getElementById('related-publications-section');
      if (!pubSection) {
        // If related publications list container doesn't exist, we add it before the footer/affiliations
        const container = document.querySelector('.section .container');
        if (container) {
          const sec = document.createElement('div');
          sec.className = 'mt-12';
          sec.id = 'related-publications-section';
          sec.innerHTML = `
            <h3>${isFrench ? 'Publications Associées' : 'Related Publications'}</h3>
            <ul class="publication-list"></ul>
          `;
          container.appendChild(sec);
          pubSection = sec;
        }
      }

      if (pubSection) {
        const list = pubSection.querySelector('.publication-list');
        if (list) {
          list.innerHTML = relatedPubs.map(pub => `
            <li class="publication-item">
              <div class="pub-title">${pub.title?.[lang] || ''}</div>
              <div class="pub-authors">${pub.authors || ''}</div>
              <div class="pub-journal">${pub.journal || ''}, ${pub.year || ''}</div>
              <div class="pub-links">
                ${pub.pdfFile ? `<a href="${fileUrlFor(pub.pdfFile)}" target="_blank">${isFrench ? 'Télécharger PDF' : 'Read PDF'}</a>` : ''}
                ${pub.pdfFile && pub.doi ? ' | ' : ''}
                ${pub.doi ? `<a href="${pub.doi}" target="_blank">DOI Link</a>` : ''}
              </div>
            </li>
          `).join('');
        }
      }
    }
  }
}

// Publications Page loader
async function loadPublicationsPage() {
  const isPubPage = window.location.pathname.includes('publications.html');
  if (!isPubPage) return;

  const query = `*[_type == "publication"] | order(year desc)`;
  const publications = await fetchFromSanity(query);
  
  const container = document.getElementById('publications-list') || document.querySelector('.publication-list');
  const emptyMsg = document.getElementById('publications-empty');
  
  if (!publications || publications.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    return;
  }

  if (container) {
    container.innerHTML = publications.map(pub => `
      <li class="publication-item">
        <div class="pub-title">${pub.title?.[lang] || ''}</div>
        <div class="pub-authors">${pub.authors || ''}</div>
        <div class="pub-journal">${pub.journal || ''}, ${pub.year || ''}</div>
        <div class="pub-links">
          ${pub.pdfFile ? `<a href="${fileUrlFor(pub.pdfFile)}" target="_blank">${isFrench ? 'Télécharger PDF' : 'Read PDF'}</a>` : ''}
          ${pub.pdfFile && pub.doi ? ' | ' : ''}
          ${pub.doi ? `<a href="${pub.doi}" target="_blank">DOI Link</a>` : ''}
        </div>
      </li>
    `).join('');
  }
}

// Blog / News Loader
async function loadBlogPage() {
  const isBlogPage = window.location.pathname.includes('blog.html');
  if (!isBlogPage) return;

  const query = `*[_type == "blogPost"] | order(date desc)`;
  const posts = await fetchFromSanity(query);
  
  const container = document.getElementById('blog-grid') || document.querySelector('.grid.grid-3, .blog-list-container');
  const emptyMsg = document.getElementById('blog-empty');
  
  if (!posts || posts.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    return;
  }

  if (container) {
    container.innerHTML = posts.map(post => `
      <div class="card hover-lift reveal reveal-up">
        ${post.image ? `<img src="${urlFor(post.image)}" alt="${post.title?.[lang] || 'Blog Post'}" class="card-image">` : ''}
        <div class="card-body">
          <span class="badge mb-2">${post.category?.[lang] || ''}</span>
          <h3 class="card-title">${post.title?.[lang] || ''}</h3>
          <div class="card-meta">${post.date || ''}</div>
          <p class="card-text">${post.excerpt?.[lang] || ''}</p>
        </div>
      </div>
    `).join('');
  }
}

// Events Calendar Loader
async function loadEventsPage() {
  const isEventsPage = window.location.pathname.includes('events.html');
  if (!isEventsPage) return;

  const query = `*[_type == "event"] | order(date asc)`;
  const events = await fetchFromSanity(query);
  
  const container = document.getElementById('events-list') || document.querySelector('.events-list-container, .grid');
  const emptyMsg = document.getElementById('events-empty');
  
  if (!events || events.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    return;
  }

  if (container) {
    container.innerHTML = events.map(evt => {
      const eventDate = new Date(evt.date);
      const day = eventDate.getDate().toString().padStart(2, '0');
      const month = eventDate.toLocaleString('default', { month: 'short' });
      return `
        <div class="card mb-4" style="flex-direction: row; align-items: center; padding: 1.5rem;">
          <div style="flex-shrink: 0; background: var(--color-bg-alt); padding: 1rem 1.5rem; border-radius: 8px; text-align: center; margin-right: 1.5rem; border: 1px solid var(--color-border);">
            <span style="display: block; font-weight: 700; color: var(--color-primary); font-size: 1.75rem; line-height: 1;">${day}</span>
            <span style="display: block; text-transform: uppercase; font-size: 0.85rem; font-weight: 600; margin-top: 0.25rem;">${month}</span>
          </div>
          <div style="flex-grow: 1;">
            <h4 style="margin: 0 0 0.25rem 0; font-size: 1.2rem;">${evt.name?.[lang] || ''}</h4>
            <p style="margin: 0; color: var(--color-text-muted); font-size: 0.95rem;">${evt.location?.[lang] || ''}</p>
            ${evt.description?.[lang] ? `<p style="margin: 0.5rem 0 0 0; color: var(--color-text-main); font-size: 0.95rem;">${evt.description[lang]}</p>` : ''}
          </div>
          ${evt.link ? `<a href="${evt.link}" target="_blank" class="btn btn-secondary" style="margin-left: 1.5rem;">${isFrench ? 'Détails' : 'View Event'}</a>` : ''}
        </div>
      `;
    }).join('');
  }
}

// Consulting Page Loader
async function loadConsultingPage() {
  const isConsultingPage = window.location.pathname.includes('lecturing.html');
  if (!isConsultingPage) return;

  const query = `*[_type == "consultingPage"][0]`;
  const data = await fetchFromSanity(query);
  if (!data) return;

  const pageTitle = document.querySelector('.page-title');
  const pageSubtitle = document.querySelector('.page-subtitle');
  
  if (pageTitle && data.heroTitle?.[lang]) pageTitle.textContent = data.heroTitle[lang];
  if (pageSubtitle && data.heroSubtitle?.[lang]) pageSubtitle.textContent = data.heroSubtitle[lang];

  // Activities detail mapping
  const serviceCards = document.querySelectorAll('.grid .card');
  if (serviceCards.length >= 4) {
    if (data.lecturingDesc?.[lang]) serviceCards[0].querySelector('p').textContent = data.lecturingDesc[lang];
    if (data.consultationDesc?.[lang]) serviceCards[1].querySelector('p').textContent = data.consultationDesc[lang];
    if (data.policyDesc?.[lang]) serviceCards[2].querySelector('p').textContent = data.policyDesc[lang];
    if (data.trainingDesc?.[lang]) serviceCards[3].querySelector('p').textContent = data.trainingDesc[lang];
  }

  // Previous Engagements timeline
  if (data.engagements && data.engagements.length > 0) {
    const engagementsTimeline = document.querySelector('.timeline');
    if (engagementsTimeline) {
      engagementsTimeline.innerHTML = data.engagements.map(eng => `
        <div class="timeline-item">
          <div class="timeline-date">${eng.date || ''}</div>
          <h4>${eng.role?.[lang] || ''}</h4>
          <p>${eng.institution?.[lang] || ''}</p>
        </div>
      `).join('');
    }
  }
}

// Press Kit / Press Page Loader
async function loadPressPage() {
  const isPressPage = window.location.pathname.includes('press.html');
  if (!isPressPage) return;

  const query = `*[_type == "pressPage"][0]`;
  const data = await fetchFromSanity(query);
  if (!data) return;

  const pressDesc = document.querySelector('a[download]').parentElement.querySelector('p');
  const pressBtn = document.querySelector('a[download]');
  const mediaContact = document.querySelector('a[href^="mailto:media@"]');

  if (pressDesc && data.pressDescription?.[lang]) pressDesc.textContent = data.pressDescription[lang];
  if (pressBtn && data.pressKitFile) pressBtn.href = fileUrlFor(data.pressKitFile);
  
  if (mediaContact && data.mediaContactEmail) {
    mediaContact.href = `mailto:${data.mediaContactEmail}`;
    mediaContact.textContent = data.mediaContactEmail;
    const mediaNameEl = mediaContact.parentElement.previousElementSibling;
    if (mediaNameEl && data.mediaContactName) {
      mediaNameEl.textContent = data.mediaContactName;
    }
  }

  // Appearances list loader
  if (data.appearances && data.appearances.length > 0) {
    const appearanceContainer = document.querySelector('.grid.gap-6');
    if (appearanceContainer) {
      appearanceContainer.innerHTML = data.appearances.map(app => `
        <div class="card p-6" style="padding: 1.5rem;">
          <h3 class="card-title">${app.title?.[lang] || ''}</h3>
          <p class="card-meta">${app.meta?.[lang] || ''}</p>
          <p>${app.summary?.[lang] || ''}</p>
          ${app.link ? `<a href="${app.link}" target="_blank" class="btn btn-secondary mt-4" style="align-self: flex-start;">${app.label?.[lang] || (isFrench ? 'Voir Article' : 'Read Article')}</a>` : ''}
        </div>
      `).join('');
    }
  }
}

// Form Submissions Handler
function setupFormHandlers() {
  // Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = isFrench ? 'Envoi en cours...' : 'Sending...';
      }

      const payload = {
        formType: 'contact',
        name: `${document.getElementById('first-name')?.value || ''} ${document.getElementById('last-name')?.value || ''}`.trim(),
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        service: document.getElementById('services')?.value || '',
        message: document.getElementById('message')?.value || ''
      };

      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (response.ok && result.success) {
          showToast(isFrench ? 'Message envoyé avec succès !' : 'Message sent successfully!', 'success');
          contactForm.reset();
        } else {
          showToast(result.error || (isFrench ? 'Erreur de transmission.' : 'Error sending message.'), 'error');
        }
      } catch (err) {
        console.error(err);
        showToast(isFrench ? 'Erreur de connexion.' : 'Network connection error.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Sign Up';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = isFrench ? 'Inscription...' : 'Signing up...';
      }

      const payload = {
        formType: 'newsletter',
        firstName: newsletterForm.querySelector('input[name="firstName"]')?.value || '',
        lastName: newsletterForm.querySelector('input[name="lastName"]')?.value || '',
        email: newsletterForm.querySelector('input[name="email"]')?.value || ''
      };

      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (response.ok && result.success) {
          showToast(isFrench ? 'Inscription réussie !' : 'Successfully subscribed!', 'success');
          newsletterForm.reset();
        } else {
          showToast(result.error || (isFrench ? 'Erreur lors de l\'inscription.' : 'Subscription failed.'), 'error');
        }
      } catch (err) {
        console.error(err);
        showToast(isFrench ? 'Erreur de connexion.' : 'Network connection error.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }
}

// Simple dynamic Toast notification
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.style.background = type === 'success' ? '#2e7d32' : '#c62828';
  toast.style.color = '#fff';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  toast.style.fontSize = '14px';
  toast.style.fontWeight = '500';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(20px)';
  toast.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  toast.textContent = message;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);

  // Hide after 4 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// Initializer on DomContentLoad
document.addEventListener('DOMContentLoaded', () => {
  loadGlobalSettings();
  loadHomepage();
  loadAboutPage();
  loadResearchPages();
  loadPublicationsPage();
  loadBlogPage();
  loadEventsPage();
  loadConsultingPage();
  loadPressPage();
  setupFormHandlers();
});
