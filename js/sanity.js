/* sanity.js - Client integration for Sanity CMS without external library dependencies */

const SANITY_PROJECT_ID = '1zncxuxn';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = 'v2021-10-21';

// Automatically detect language based on URL path
const isFrench = window.location.pathname.includes('/fr/');
const lang = isFrench ? 'fr' : 'en';

// Helper to resolve Sanity Image asset references to CDN URLs
function urlFor(source) {
  if (!source || !source.asset) return '';
  if (source.asset.url) return source.asset.url;
  if (!source.asset._ref) return '';
  const ref = source.asset._ref;
  // Format: image-[id]-[dimensions]-[extension]
  const parts = ref.split('-');
  if (parts.length < 4) return '';
  const ext = parts.pop();
  const dimensions = parts.pop();
  parts.shift(); // remove 'image'
  const id = parts.join('-');
  return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${ext}`;
}

// Helper to resolve Sanity File asset references to CDN URLs
function fileUrlFor(source) {
  if (!source || !source.asset) return '';
  if (source.asset.url) return source.asset.url;
  if (!source.asset._ref) return '';
  const ref = source.asset._ref;
  // Format: file-[id]-[extension]
  const parts = ref.split('-');
  if (parts.length < 3) return '';
  const ext = parts.pop();
  parts.shift(); // remove 'file'
  const id = parts.join('-');
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

// Global settings loader: Header title, Nav items, Footer, social links, logo affiliations, newsletter
async function loadGlobalSettings() {
  const query = `*[_type == "globalSettings"][0]`;
  const settings = await fetchFromSanity(query);
  if (!settings) return;

  // Site Title across Header and Footer
  if (settings.siteTitle?.[lang]) {
    const siteTitleElems = document.querySelectorAll('.site-title');
    siteTitleElems.forEach(el => {
      el.textContent = settings.siteTitle[lang];
    });
  }

  // Header Navigation Menu
  if (settings.navItems && settings.navItems.length > 0) {
    const navContainer = document.querySelector('.main-nav');
    if (navContainer) {
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      const closeBtn = navContainer.querySelector('.nav-close-btn');
      const langToggles = navContainer.querySelectorAll('.lang-toggle, .lang-separator');

      let navHTML = '';
      if (closeBtn) navHTML += closeBtn.outerHTML;

      settings.navItems.forEach(item => {
        const itemUrl = item.url || '#';
        const itemLabel = item.label?.[lang] || '';
        const isActive = currentPath === itemUrl || (currentPath === '' && itemUrl === 'index.html');
        const href = isFrench ? (itemUrl.startsWith('fr/') ? itemUrl : `fr/${itemUrl}`) : itemUrl.replace(/^fr\//, '');
        navHTML += `<a href="${href}" class="nav-link ${isActive ? 'active' : ''}">${itemLabel}</a>`;
      });

      langToggles.forEach(el => {
        navHTML += el.outerHTML;
      });

      navContainer.innerHTML = navHTML;
    }
  }

  // Footer Bio / Tagline
  if (settings.footerBio?.[lang]) {
    const footerBioEl = document.querySelector('.site-footer .site-title + p');
    if (footerBioEl) footerBioEl.textContent = settings.footerBio[lang];
  }

  // Footer Navigation Links
  const footerLists = document.querySelectorAll('.footer-grid .footer-links');
  if (settings.footerNavLinks && settings.footerNavLinks.length > 0) {
    const footerNavUl = document.querySelector('ul[data-footer-col="nav"]') || footerLists[0];
    if (footerNavUl) {
      footerNavUl.innerHTML = settings.footerNavLinks.map(item => {
        const itemUrl = item.url || '#';
        const itemLabel = item.label?.[lang] || '';
        const href = isFrench ? (itemUrl.startsWith('fr/') ? itemUrl : `fr/${itemUrl}`) : itemUrl.replace(/^fr\//, '');
        return `<li><a href="${href}">${itemLabel}</a></li>`;
      }).join('');
    }
  }

  // Footer Research Links
  if (settings.footerResearchLinks && settings.footerResearchLinks.length > 0) {
    const footerResearchUl = document.querySelector('ul[data-footer-col="research"]') || footerLists[1];
    if (footerResearchUl) {
      footerResearchUl.innerHTML = settings.footerResearchLinks.map(item => {
        const itemUrl = item.url || '#';
        const itemLabel = item.label?.[lang] || '';
        const href = isFrench ? (itemUrl.startsWith('fr/') ? itemUrl : `fr/${itemUrl}`) : itemUrl.replace(/^fr\//, '');
        return `<li><a href="${href}">${itemLabel}</a></li>`;
      }).join('');
    }
  }

  // Footer Legal Links
  if (settings.footerLegalLinks && settings.footerLegalLinks.length > 0) {
    const footerLegalUl = document.querySelector('ul[data-footer-col="legal"]') || footerLists[2];
    if (footerLegalUl) {
      footerLegalUl.innerHTML = settings.footerLegalLinks.map(item => {
        const itemUrl = item.url || '#';
        const itemLabel = item.label?.[lang] || '';
        const href = isFrench ? (itemUrl.startsWith('fr/') ? itemUrl : `fr/${itemUrl}`) : itemUrl.replace(/^fr\//, '');
        return `<li><a href="${href}">${itemLabel}</a></li>`;
      }).join('');
    }
  }

  // Footer Copyright Notice
  if (settings.footerCopyright?.[lang]) {
    const copyrightEl = document.querySelector('.footer-bottom p');
    if (copyrightEl) copyrightEl.textContent = settings.footerCopyright[lang];
  }

  // Newsletter Title & Subtitle in Footer
  if (settings.newsletterTitle?.[lang]) {
    const newsTitleEl = document.querySelector('.site-footer .footer-title.text-center');
    if (newsTitleEl) newsTitleEl.textContent = settings.newsletterTitle[lang];
  }
  if (settings.newsletterSubtitle?.[lang]) {
    const newsSubEl = document.querySelector('.site-footer p.text-center.text-muted');
    if (newsSubEl) newsSubEl.textContent = settings.newsletterSubtitle[lang];
  }

  // Social Links
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
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
      if (link.href.includes('contact@') || link.textContent.includes('contact@')) {
        link.href = `mailto:${settings.contactEmail}`;
        link.textContent = settings.contactEmail;
      }
    });
  }

  // Affiliations inside Footer
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
  const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/fr/') || window.location.pathname.endsWith('/fr');
  if (!isHome) return;

  const query = `*[_type == "homepage"][0]`;
  const data = await fetchFromSanity(query);
  if (!data) return;

  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroImage = document.querySelector('.profile-img');
  const introTitle = document.querySelector('.section h2');
  const introDesc = document.querySelector('.section p[style*="max-width"]');
  const researchSectionTitle = document.querySelector('.section:nth-of-type(2) h2');

  if (heroTitle && data.heroTitle?.[lang]) heroTitle.textContent = data.heroTitle[lang];
  if (heroSubtitle && data.heroSubtitle?.[lang]) heroSubtitle.textContent = data.heroSubtitle[lang];
  if (heroImage && data.profileImage) heroImage.src = urlFor(data.profileImage);
  if (introTitle && data.introTitle?.[lang]) introTitle.textContent = data.introTitle[lang];
  if (introDesc && data.introDescription?.[lang]) introDesc.textContent = data.introDescription[lang];
  if (researchSectionTitle && data.researchTitle?.[lang]) researchSectionTitle.textContent = data.researchTitle[lang];

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
  const isAboutPage = window.location.pathname.includes('about.html');
  if (!isAboutPage) return;

  const query = `*[_type == "aboutPage"][0]`;
  const data = await fetchFromSanity(query);
  if (!data) return;

  const pageTitle = document.querySelector('.page-title');
  const pageSubtitle = document.querySelector('.page-subtitle');
  const bioContainer = document.getElementById('about-bio-content');
  const profileImage = document.querySelector('.about-image');
  const cvLink = document.getElementById('cv-download-link');
  const journeyTitle = document.querySelector('.section-bg-alt h2');

  if (pageTitle && data.pageTitle?.[lang]) pageTitle.textContent = data.pageTitle[lang];
  if (pageSubtitle && data.pageSubtitle?.[lang]) pageSubtitle.textContent = data.pageSubtitle[lang];
  if (journeyTitle && data.journeyTitle?.[lang]) journeyTitle.textContent = data.journeyTitle[lang];

  // Biography content
  if (bioContainer && data.bioContent?.[lang]) {
    const titleHTML = `<h2>${data.bioTitle?.[lang] || (isFrench ? 'Biographie professionnelle' : 'Professional Biography')}</h2>`;
    const blocksHTML = portableTextToHTML(data.bioContent[lang]);
    bioContainer.innerHTML = titleHTML + blocksHTML;
  } else if (bioContainer && data.bioTitle?.[lang]) {
    const h2 = bioContainer.querySelector('h2');
    if (h2) h2.textContent = data.bioTitle[lang];
  }

  if (profileImage && data.profileImage) profileImage.src = urlFor(data.profileImage);

  // CV File download & label
  if (cvLink) {
    if (data.cvFile) {
      const cvUrl = fileUrlFor(data.cvFile);
      if (cvUrl) {
        cvLink.href = cvUrl;
        cvLink.setAttribute('download', '');
        cvLink.setAttribute('target', '_blank');
      }
    }
    if (data.cvButtonLabel?.[lang]) cvLink.textContent = data.cvButtonLabel[lang];
  }

  // Quick Facts
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

// Contact Page loader
async function loadContactPage() {
  const isContact = window.location.pathname.includes('contact.html');
  if (!isContact) return;

  const query = `*[_type == "contactPage"][0]`;
  const data = await fetchFromSanity(query);
  if (!data) return;

  const pageTitle = document.querySelector('.page-title');
  const pageSubtitle = document.querySelector('.page-subtitle');
  const connectTitle = document.querySelector('.reveal-right h2');
  const connectDesc = document.querySelector('.reveal-right p.mb-8');
  const socialTitle = document.querySelector('.reveal-right h4.mb-4');
  const contactForm = document.getElementById('contact-form');

  if (pageTitle && data.heroTitle?.[lang]) pageTitle.textContent = data.heroTitle[lang];
  if (pageSubtitle && data.heroSubtitle?.[lang]) pageSubtitle.textContent = data.heroSubtitle[lang];
  if (connectTitle && data.connectTitle?.[lang]) connectTitle.textContent = data.connectTitle[lang];
  if (connectDesc && data.connectDescription?.[lang]) connectDesc.textContent = data.connectDescription[lang];
  if (socialTitle && data.socialTitle?.[lang]) socialTitle.textContent = data.socialTitle[lang];

  if (contactForm) {
    if (data.submitButtonLabel?.[lang]) {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.textContent = data.submitButtonLabel[lang];
    }
    if (data.formTitle?.[lang]) {
      let formTitleEl = contactForm.querySelector('.form-title');
      if (!formTitleEl) {
        formTitleEl = document.createElement('h3');
        formTitleEl.className = 'form-title mb-4';
        contactForm.prepend(formTitleEl);
      }
      formTitleEl.textContent = data.formTitle[lang];
    }
  }

  // Service Dropdown Options
  if (data.serviceOptions && data.serviceOptions.length > 0) {
    const servicesSelect = document.getElementById('services');
    if (servicesSelect) {
      servicesSelect.innerHTML = `
        <option value="">${isFrench ? '-- Sélectionnez une option --' : '-- Select an option --'}</option>
        ${data.serviceOptions.map(opt => `<option value="${opt.value || ''}">${opt.label?.[lang] || opt.value || ''}</option>`).join('')}
      `;
    }
  }
}

// Research Page & Subpages loader
async function loadResearchPages() {
  const isResearchOverview = window.location.pathname.endsWith('research.html') || window.location.pathname.endsWith('/fr/research.html');
  const isFgmPage = window.location.pathname.includes('research-fgm');
  const isFibroidsPage = window.location.pathname.includes('research-fibroids');

  // If on research overview page, load researchPage document
  if (isResearchOverview) {
    const researchPageQuery = `*[_type == "researchPage"][0]`;
    const rpData = await fetchFromSanity(researchPageQuery);
    if (rpData) {
      const pageTitle = document.querySelector('.page-title');
      const pageSubtitle = document.querySelector('.page-subtitle');
      const overviewP = document.querySelector('.section.pt-0 p');
      const sectionTitle = document.querySelector('.section-bg-alt h2');

      if (pageTitle && rpData.pageTitle?.[lang]) pageTitle.textContent = rpData.pageTitle[lang];
      if (pageSubtitle && rpData.pageSubtitle?.[lang]) pageSubtitle.textContent = rpData.pageSubtitle[lang];
      if (overviewP && rpData.overviewText?.[lang]) overviewP.textContent = rpData.overviewText[lang];
      if (sectionTitle && rpData.sectionTitle?.[lang]) sectionTitle.textContent = rpData.sectionTitle[lang];
    }
  }

  // Update research cards across overview page and homepage
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
          const btn = card.querySelector('.btn');

          if (title && area.title?.[lang]) title.textContent = area.title[lang];
          if (badge && area.badge?.[lang]) badge.textContent = area.badge[lang];
          if (desc && area.shortDescription?.[lang]) desc.textContent = area.shortDescription[lang];
          if (img && area.bannerImage) img.src = urlFor(area.bannerImage);
          if (btn && area.buttonLabel?.[lang]) btn.textContent = area.buttonLabel[lang];
        }
      });
    });
  }

  // Individual detail pages
  if (isFgmPage || isFibroidsPage) {
    const slug = isFgmPage ? 'fgm' : 'fibroids';
    const queryArea = `*[_type == "researchArea" && slug.current match "*${slug}*"][0]`;
    const data = await fetchFromSanity(queryArea);
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
      let pubSection = document.getElementById('related-publications-section');
      if (!pubSection) {
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
  const introDesc = document.querySelector('.consulting-hero + .section .text-center p');
  const activitiesTitle = document.querySelector('.section h2.text-center');
  
  if (pageTitle && data.heroTitle?.[lang]) pageTitle.textContent = data.heroTitle[lang];
  if (pageSubtitle && data.heroSubtitle?.[lang]) pageSubtitle.textContent = data.heroSubtitle[lang];
  if (introDesc && data.introDescription?.[lang]) introDesc.textContent = data.introDescription[lang];
  if (activitiesTitle && data.activitiesTitle?.[lang]) activitiesTitle.textContent = data.activitiesTitle[lang];

  // Activities detail mapping (using .activity-card)
  const activityCards = document.querySelectorAll('.activity-card');
  if (activityCards.length >= 4) {
    if (data.lecturingTitle?.[lang]) activityCards[0].querySelector('h3').textContent = data.lecturingTitle[lang];
    if (data.lecturingDesc?.[lang]) activityCards[0].querySelector('p').textContent = data.lecturingDesc[lang];

    if (data.consultationTitle?.[lang]) activityCards[1].querySelector('h3').textContent = data.consultationTitle[lang];
    if (data.consultationDesc?.[lang]) activityCards[1].querySelector('p').textContent = data.consultationDesc[lang];

    if (data.policyTitle?.[lang]) activityCards[2].querySelector('h3').textContent = data.policyTitle[lang];
    if (data.policyDesc?.[lang]) activityCards[2].querySelector('p').textContent = data.policyDesc[lang];

    if (data.trainingTitle?.[lang]) activityCards[3].querySelector('h3').textContent = data.trainingTitle[lang];
    if (data.trainingDesc?.[lang]) activityCards[3].querySelector('p').textContent = data.trainingDesc[lang];
  }

  // Previous Engagements section header & timeline
  const engagementsList = document.getElementById('engagements-list');
  if (data.engagementsSectionTitle?.[lang]) {
    const engagementsHeading = engagementsList?.closest('.card')?.parentElement?.querySelector('h2');
    if (engagementsHeading) engagementsHeading.textContent = data.engagementsSectionTitle[lang];
  }

  if (engagementsList && data.engagements && data.engagements.length > 0) {
    engagementsList.innerHTML = data.engagements.map(eng => `
      <li class="engagement-item">
        <span class="engagement-org">${eng.institution?.[lang] || ''}</span>
        <span class="engagement-role">${eng.role?.[lang] || ''}</span>
        <span class="engagement-year">${eng.date || ''}</span>
      </li>
    `).join('');
  }

  // Booking / Collaboration Card
  if (data.bookingTitle?.[lang]) {
    const bookingHeading = document.querySelector('.reveal-right .card h3');
    if (bookingHeading) bookingHeading.textContent = data.bookingTitle[lang];
  }
  if (data.bookingDescription?.[lang]) {
    const bookingDesc = document.querySelector('.reveal-right .card p.text-muted');
    if (bookingDesc) bookingDesc.textContent = data.bookingDescription[lang];
  }
  if (data.bookingButtonLabel?.[lang]) {
    const bookingBtn = document.querySelector('.reveal-right .card a.btn-primary');
    if (bookingBtn) bookingBtn.textContent = data.bookingButtonLabel[lang];
  }
}

// Press Kit / Press Page Loader
async function loadPressPage() {
  const isPressPage = window.location.pathname.includes('press.html');
  if (!isPressPage) return;

  const query = `*[_type == "pressPage"][0]`;
  const data = await fetchFromSanity(query);
  if (!data) return;

  const pageTitle = document.querySelector('.page-title');
  const pageSubtitle = document.querySelector('.page-subtitle');
  const pressDesc = document.querySelector('a[download]')?.parentElement?.querySelector('p');
  const pressBtn = document.querySelector('a[download]');
  const mediaContact = document.querySelector('a[href^="mailto:media@"]');

  if (pageTitle && data.heroTitle?.[lang]) pageTitle.textContent = data.heroTitle[lang];
  if (pageSubtitle && data.heroSubtitle?.[lang]) pageSubtitle.textContent = data.heroSubtitle[lang];

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

  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);

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
  loadContactPage();
  setupFormHandlers();
});
