(() => {
  'use strict';

  const clamp = (value) => Math.max(0, Math.min(1, value));
  // Matches the source reveal envelope for pinned editorial scenes.
  const sceneReveal = (progress) => Math.max(0, Math.min(1, progress / 0.22, (1 - progress) / 0.18));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setupMobileNavigation() {
    const header = document.querySelector('.site-header');
    const toggle = header?.querySelector('.mobile-menu-toggle');
    const desktopNav = header?.querySelector('.desktop-nav');
    if (!header || !toggle || !desktopNav) return;

    let nav = header.querySelector('#mobile-navigation');
    if (!nav) {
      nav = desktopNav.cloneNode(true);
      nav.id = 'mobile-navigation';
      nav.className = 'mobile-nav';
      nav.setAttribute('aria-label', 'Mobile navigation');
      nav.hidden = true;
      const cta = header.querySelector('.header-cta a');
      if (cta) nav.append(cta.cloneNode(true));
      header.append(nav);
    }

    const setMenuIcon = (open) => {
      const oldIcon = toggle.querySelector('svg');
      if (!oldIcon) return;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '24');
      svg.setAttribute('height', '24');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      svg.setAttribute('class', `lucide lucide-${open ? 'x' : 'menu'}`);
      svg.setAttribute('aria-hidden', 'true');
      (open ? ['M18 6 6 18', 'm6 6 12 12'] : ['M4 5h16', 'M4 12h16', 'M4 19h16']).forEach((pathData) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        svg.append(path);
      });
      oldIcon.replaceWith(svg);
    };
    const closeMenu = (restoreFocus = false) => {
      nav.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      setMenuIcon(false);
      if (restoreFocus) toggle.focus();
    };

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      nav.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      setMenuIcon(open);
      if (open) nav.querySelector('a')?.focus();
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !nav.hidden) closeMenu(true);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 767 && !nav.hidden) closeMenu();
    }, { passive: true });
  }

  function setupProcessAccordion() {
    const names = ['DISCOVER', 'DEFINE', 'DESIGN', 'BUILD', 'LAUNCH', 'GROW'];
    const descriptions = [
      'Listen first. Understand the brand, the customer and what the current experience is asking them to do.',
      'Agree on the problem, the priorities and what a better experience should make possible.',
      'Shape the journey, the hierarchy and the interface. Make every decision earn its place.',
      'Turn the design into a considered, usable storefront or custom digital experience.',
      'Test the details, check the journeys and bring the experience into the real world.',
      'Listen to what the experience tells us. Improve with intention as the business evolves.'
    ];
    const icon = (expanded) => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '15');
      svg.setAttribute('height', '15');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      svg.setAttribute('class', `lucide lucide-${expanded ? 'minus' : 'plus'}`);
      svg.setAttribute('aria-hidden', 'true');
      const horizontal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      horizontal.setAttribute('d', 'M5 12h14');
      svg.append(horizontal);
      if (!expanded) {
        const vertical = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        vertical.setAttribute('d', 'M12 5v14');
        svg.append(vertical);
      }
      return svg;
    };

    document.querySelectorAll('.process-list').forEach((list) => {
      const steps = [...list.querySelectorAll('.process-step')];
      const section = list.closest('.expressive-process');
      const number = section?.querySelector('.dial-number');
      const name = section?.querySelector('.dial-name');
      const fill = section?.querySelector('.dial-fill');

      const setActive = (activeIndex) => {
        steps.forEach((step, index) => {
          const button = step.querySelector('.process-trigger');
          if (!button || !descriptions[index]) return;
          const id = button.getAttribute('aria-controls') || `process-${index}`;
          button.setAttribute('aria-controls', id);
          let detail = document.getElementById(id);
          if (!detail) {
            detail = document.createElement('p');
            detail.id = id;
            button.insertAdjacentElement('afterend', detail);
          }
          detail.textContent = descriptions[index];
          const expanded = index === activeIndex;
          step.classList.toggle('is-active', expanded);
          button.setAttribute('aria-expanded', String(expanded));
          detail.hidden = !expanded;
          const oldIcon = button.querySelector('svg');
          if (oldIcon) oldIcon.replaceWith(icon(expanded));
        });

        if (number && name && fill) {
          const dialIndex = activeIndex < 0 ? 0 : activeIndex;
          number.textContent = `0${dialIndex + 1}`;
          name.textContent = names[dialIndex];
          fill.style.strokeDashoffset = String(565.5 * (1 - (dialIndex + 1) / 6));
          number.style.animation = 'none';
          name.style.animation = 'none';
          void number.offsetWidth;
          number.style.removeProperty('animation');
          name.style.removeProperty('animation');
        }
      };

      const initial = steps.findIndex((step) => step.querySelector('.process-trigger')?.getAttribute('aria-expanded') === 'true');
      setActive(initial < 0 ? 0 : initial);
      steps.forEach((step, index) => {
        const button = step.querySelector('.process-trigger');
        if (!button) return;
        step.addEventListener('mouseenter', () => setActive(index));
        button.addEventListener('focus', () => setActive(index));
        button.addEventListener('click', () => {
          const isActive = button.getAttribute('aria-expanded') === 'true';
          setActive(isActive ? -1 : index);
        });
      });
    });
  }

  function setupIndustries() {
    const industries = [
      { name: 'Jewellery', line: 'Detail, sparkle and confidence before checkout.' },
      { name: 'Fashion', line: 'Collections, sizing and a fast path to the right fit.' },
      { name: 'Home Decor', line: 'Space for objects, materials and the room they live in.' },
      { name: 'Wellness', line: 'Clear rituals, ingredients and routines.' },
      { name: 'Electronics', line: 'Specs, comparisons and the reassurance to buy.' }
    ];
    document.querySelectorAll('.industries').forEach((section) => {
      const buttons = [...section.querySelectorAll('[data-industry]')];
      const objects = [...section.querySelectorAll('.industry-object')];
      const ghost = section.querySelector('.industries-ghost');
      const card = section.querySelector('.industries-card');
      if (!buttons.length || !objects.length || !ghost || !card) return;

      const select = (index) => {
        const item = industries[index];
        if (!item) return;
        buttons.forEach((button, current) => {
          const active = current === index;
          button.classList.toggle('active', active);
          button.setAttribute('aria-pressed', String(active));
        });
        objects.forEach((image, current) => {
          const active = current === index;
          image.classList.toggle('is-active', active);
          image.setAttribute('aria-hidden', String(!active));
          image.alt = active ? `Original ${item.name.toLowerCase()} product concept` : '';
        });
        ghost.textContent = item.name;
        const label = card.querySelector('.eyebrow');
        const copy = card.querySelector('p');
        if (label) label.textContent = `${item.name.toUpperCase()} / COMMERCE`;
        if (copy) copy.textContent = item.line;
        ghost.style.animation = 'none';
        card.style.animation = 'none';
        void ghost.offsetWidth;
        ghost.style.removeProperty('animation');
        card.style.removeProperty('animation');
      };

      buttons.forEach((button) => {
        const index = Number(button.dataset.industry);
        button.addEventListener('mouseenter', () => select(index));
        button.addEventListener('focus', () => select(index));
        button.addEventListener('click', () => select(index));
      });
    });
  }

  function setupJourney() {
    const steps = [
      { name: 'DISCOVER', title: 'The first impression.', copy: 'A useful search. A clear point of entry. The right product, before the customer has to ask.' },
      { name: 'EXPLORE', title: 'Room to find their thing.', copy: 'Collections, navigation and filtering that make a range feel approachable — not overwhelming.' },
      { name: 'CHOOSE', title: 'A decision made easier.', copy: 'Clear product information, considered images and variants that make sense in context.' },
      { name: 'TRUST', title: 'Confidence comes first.', copy: 'Useful details, transparent information and reassurance at the moment it matters.' },
      { name: 'BUY', title: 'Less between yes and bought.', copy: 'A clear cart and a considered checkout. No unnecessary detours at the final step.' }
    ];
    const journeys = [...document.querySelectorAll('.journey-vivid')];
    const state = journeys.map((section) => {
      const staticSteps = document.createElement('div');
      staticSteps.className = 'journey-static-steps';
      staticSteps.hidden = true;
      steps.slice(1).forEach((step) => {
        const article = document.createElement('article');
        const label = document.createElement('span');
        label.className = 'eyebrow text-primary';
        label.textContent = step.name;
        const title = document.createElement('h3');
        title.textContent = step.title;
        const copy = document.createElement('p');
        copy.textContent = step.copy;
        article.append(label, title, copy);
        staticSteps.append(article);
      });
      section.querySelector('.journey-sticky .container')?.append(staticSteps);
      return { section, staticSteps, top: 0, height: 0, visibleHeight: 0, stage: -1 };
    });

    const updateStage = (item, stage) => {
      const { section } = item;
      if (item.stage === stage) return;
      item.stage = stage;
      section.dataset.step = String(stage);
      const step = steps[stage];
      const tabs = [...section.querySelectorAll('.journey-tab')];
      tabs.forEach((tab, index) => {
        tab.classList.toggle('active', index === stage);
        if (index === stage) tab.setAttribute('aria-current', 'step');
        else tab.removeAttribute('aria-current');
      });

      const index = section.querySelector('.journey-index');
      const reveal = section.querySelector('.journey-copy-reveal');
      if (index) index.textContent = `0${stage + 1}`;
      if (reveal) {
        const name = reveal.querySelector('.journey-stage-name');
        const title = reveal.querySelector('h3');
        const copy = reveal.querySelector('p');
        if (name) name.textContent = step.name;
        if (title) title.textContent = step.title;
        if (copy) copy.textContent = step.copy;
        reveal.style.animation = 'none';
        void reveal.offsetHeight;
        reveal.style.animation = '';
      }

      const screen = section.querySelector('.journey-screen');
      if (screen) {
        screen.className = screen.className.replace(/\bstage-\d\b/g, '').trim();
        screen.classList.add(`stage-${stage}`);
        const detail = stage >= 2;
        screen.querySelector('.store-toolbar')?.setAttribute('aria-hidden', String(detail));
        screen.querySelector('.store-discovery')?.setAttribute('aria-hidden', String(stage !== 0));
        screen.querySelector('.store-detail')?.setAttribute('aria-hidden', String(stage !== 2));
        screen.querySelector('.store-trust')?.setAttribute('aria-hidden', String(stage !== 3));
        screen.querySelector('.store-cart')?.setAttribute('aria-hidden', String(stage !== 4));
        screen.querySelectorAll('.store-object').forEach((object, objectIndex) => {
          object.setAttribute('aria-hidden', String(detail && objectIndex > 0));
        });
        const filterLabels = screen.querySelectorAll('.ui-filter span');
        if (filterLabels[0]) filterLabels[0].textContent = stage === 0 ? 'CONSIDERED OBJECTS. EVERYDAY RITUALS.' : 'ALL OBJECTS / 03 PRODUCTS';
        if (filterLabels[1]) filterLabels[1].textContent = stage === 0 ? 'DISCOVER ↗' : 'FILTER + / SORT ↓';
      }
    };

    return {
      measure() {
        state.forEach((item) => {
          const rect = item.section.getBoundingClientRect();
          item.top = rect.top + window.scrollY;
          item.height = item.section.offsetHeight;
          item.visibleHeight = item.section.querySelector('.journey-sticky')?.clientHeight || window.innerHeight;
        });
      },
      paint() {
        state.forEach((item) => {
          const position = item.top - window.scrollY;
          const range = Math.max(1, item.height - item.visibleHeight);
          const progress = clamp(-position / range);
          item.section.style.setProperty('--journey-progress', progress.toFixed(4));
          updateStage(item, Math.min(4, Math.floor(progress * 5)));
        });
      },
      setReduced(reduced) {
        state.forEach((item) => {
          item.section.classList.toggle('is-reduced', reduced);
          item.staticSteps.hidden = !reduced;
          if (reduced) {
            item.stage = -1;
            updateStage(item, 0);
          }
        });
      }
    };
  }

  function setupContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    const fields = [...form.querySelectorAll('input:not([type="hidden"])[name], select[name], textarea[name]')];
    const budget = form.querySelector('[name="budget"]');
    const countryInput = form.querySelector('[name="country"]');
    const currencyInput = form.querySelector('[name="currency"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const submitLabel = [...(submitButton?.childNodes || [])].find((node) => node.nodeType === Node.TEXT_NODE);
    const originalSubmitLabel = submitLabel?.textContent?.trim() || 'START A CONVERSATION';
    const errorStatus = form.querySelector('[data-form-error]');
    const successStatus = document.querySelector('.contact-success');

    const currencyByCountry = {
      IN: 'INR', US: 'USD', GB: 'GBP', CA: 'CAD', AU: 'AUD', NZ: 'NZD', SG: 'SGD',
      JP: 'JPY', CH: 'CHF', LI: 'CHF', CN: 'CNY', HK: 'HKD', TW: 'TWD', KR: 'KRW',
      MX: 'MXN', BR: 'BRL', AR: 'ARS', CO: 'COP', PE: 'PEN', CL: 'CLP', BO: 'BOB',
      PY: 'PYG', UY: 'UYU', CR: 'CRC', DO: 'DOP', JM: 'JMD', TT: 'TTD',
      ZA: 'ZAR', AE: 'AED', SA: 'SAR', QA: 'QAR', KW: 'KWD', BH: 'BHD', OM: 'OMR',
      IL: 'ILS', TR: 'TRY', RU: 'RUB', PL: 'PLN', CZ: 'CZK', HU: 'HUF', RO: 'RON',
      SE: 'SEK', NO: 'NOK', DK: 'DKK', IS: 'ISK', RS: 'RSD', BA: 'BAM', MK: 'MKD',
      MD: 'MDL', BY: 'BYN', AM: 'AMD', AZ: 'AZN', GE: 'GEL', KZ: 'KZT', UZ: 'UZS',
      AL: 'ALL', ID: 'IDR', MY: 'MYR', TH: 'THB', PH: 'PHP', VN: 'VND', PK: 'PKR',
      BD: 'BDT', NP: 'NPR', LK: 'LKR', EG: 'EGP', NG: 'NGN', KE: 'KES', GH: 'GHS',
      ET: 'ETB', MA: 'MAD', TN: 'TND', DZ: 'DZD', IR: 'IRR', IQ: 'IQD', JO: 'JOD',
      LB: 'LBP', AF: 'AFN', KH: 'KHR', MM: 'MMK', MN: 'MNT', EC: 'USD', SV: 'USD'
    };
    const euroCountries = new Set([
      'AT', 'BE', 'BG', 'HR', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT',
      'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES', 'AD', 'MC', 'SM',
      'VA', 'ME', 'XK'
    ]);
    const timeZoneCountries = {
      'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Europe/London': 'GB',
      'Europe/Vienna': 'AT', 'Europe/Brussels': 'BE', 'Europe/Sofia': 'BG',
      'Europe/Zagreb': 'HR', 'Asia/Nicosia': 'CY', 'Europe/Nicosia': 'CY',
      'Europe/Tallinn': 'EE', 'Europe/Helsinki': 'FI', 'Europe/Paris': 'FR',
      'Europe/Berlin': 'DE', 'Europe/Athens': 'GR', 'Europe/Dublin': 'IE',
      'Europe/Rome': 'IT', 'Europe/Riga': 'LV', 'Europe/Vilnius': 'LT',
      'Europe/Luxembourg': 'LU', 'Europe/Malta': 'MT', 'Europe/Amsterdam': 'NL',
      'Europe/Lisbon': 'PT', 'Europe/Bratislava': 'SK', 'Europe/Ljubljana': 'SI',
      'Europe/Madrid': 'ES', 'Europe/Monaco': 'MC', 'Europe/Andorra': 'AD',
      'Europe/San_Marino': 'SM', 'Europe/Vatican': 'VA', 'Europe/Podgorica': 'ME',
      'Europe/Belgrade': 'RS', 'Europe/Pristina': 'XK', 'Europe/Zurich': 'CH',
      'Europe/Oslo': 'NO', 'Europe/Stockholm': 'SE', 'Europe/Copenhagen': 'DK',
      'Europe/Warsaw': 'PL', 'Europe/Prague': 'CZ', 'Europe/Budapest': 'HU',
      'Europe/Bucharest': 'RO', 'Europe/Istanbul': 'TR', 'Europe/Moscow': 'RU',
      'Europe/Kyiv': 'UA', 'Europe/Kiev': 'UA', 'Europe/Chisinau': 'MD',
      'Europe/Sarajevo': 'BA', 'Europe/Skopje': 'MK', 'Europe/Tirane': 'AL',
      'America/Toronto': 'CA',
      'America/Vancouver': 'CA', 'America/Edmonton': 'CA', 'America/Winnipeg': 'CA',
      'America/Halifax': 'CA', 'America/St_Johns': 'CA', 'America/Regina': 'CA',
      'America/Whitehorse': 'CA', 'America/Yellowknife': 'CA', 'America/Iqaluit': 'CA',
      'America/New_York': 'US', 'America/Detroit': 'US', 'America/Chicago': 'US',
      'America/Denver': 'US', 'America/Phoenix': 'US', 'America/Los_Angeles': 'US',
      'America/Anchorage': 'US', 'America/Adak': 'US', 'Pacific/Honolulu': 'US',
      'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Brisbane': 'AU',
      'Australia/Perth': 'AU', 'Australia/Adelaide': 'AU', 'Australia/Hobart': 'AU',
      'Pacific/Auckland': 'NZ', 'Pacific/Chatham': 'NZ', 'Asia/Singapore': 'SG',
      'Asia/Tokyo': 'JP', 'Asia/Seoul': 'KR', 'Asia/Shanghai': 'CN',
      'Asia/Hong_Kong': 'HK', 'Asia/Taipei': 'TW', 'Asia/Dubai': 'AE',
      'Asia/Riyadh': 'SA', 'Asia/Doha': 'QA', 'Asia/Kuwait': 'KW',
      'Asia/Jerusalem': 'IL', 'Asia/Tehran': 'IR', 'Asia/Baghdad': 'IQ',
      'America/Mexico_City': 'MX', 'America/Monterrey': 'MX', 'America/Tijuana': 'MX',
      'America/Cancun': 'MX', 'America/Buenos_Aires': 'AR',
      'America/Sao_Paulo': 'BR', 'America/Bogota': 'CO', 'America/Lima': 'PE',
      'America/Santiago': 'CL', 'Asia/Jakarta': 'ID', 'Asia/Kuala_Lumpur': 'MY',
      'Asia/Bangkok': 'TH', 'Asia/Manila': 'PH', 'Asia/Ho_Chi_Minh': 'VN',
      'Asia/Karachi': 'PK', 'Asia/Dhaka': 'BD', 'Asia/Kathmandu': 'NP',
      'Asia/Colombo': 'LK', 'Africa/Cairo': 'EG', 'Africa/Lagos': 'NG',
      'Africa/Nairobi': 'KE', 'Africa/Accra': 'GH', 'Africa/Johannesburg': 'ZA',
      'Africa/Addis_Ababa': 'ET', 'Africa/Casablanca': 'MA', 'Africa/Tunis': 'TN',
      'Africa/Algiers': 'DZ'
    };
    const rangesByCurrency = {
      INR: [5000, 10000, 20000, 30000], JPY: [50000, 100000, 200000, 300000],
      KRW: [500000, 1000000, 2000000, 3000000], IDR: [5000000, 10000000, 20000000, 30000000],
      VND: [5000000, 10000000, 20000000, 30000000], PKR: [150000, 300000, 600000, 900000],
      BDT: [50000, 100000, 200000, 300000], NPR: [50000, 100000, 200000, 300000],
      LKR: [150000, 300000, 600000, 900000]
    };
    const countryName = (code) => {
      try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code; }
      catch { return code; }
    };
    const localeRegion = () => {
      const locales = [...(navigator.languages || []), navigator.language].filter(Boolean);
      for (const locale of locales) {
        try {
          const region = new Intl.Locale(locale.replace(/_/g, '-')).region;
          if (region) return region.toUpperCase() === 'UK' ? 'GB' : region.toUpperCase();
        } catch { /* Ignore malformed or unsupported browser locale values. */ }
      }
      return '';
    };
    const detectLocation = () => {
      let timeZone = '';
      try { timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; }
      catch { /* Some embedded browsers do not expose a resolved time zone. */ }
      const region = timeZoneCountries[timeZone] || localeRegion() || 'IN';
      // Keep INR as the detection-failure fallback above; use USD for detected countries without a local mapping.
      const currency = euroCountries.has(region) ? 'EUR' : (currencyByCountry[region] || 'USD');
      return { region, country: countryName(region), currency, timeZone };
    };
    const budgetOptions = (location) => {
      if (location.currency === 'INR') {
        return ['Under ₹5,000', '₹5,000 – ₹10,000', '₹10,000 – ₹20,000', '₹20,000 – ₹30,000', '₹30,000+'];
      }
      if (location.currency === 'USD') return ['Under $500', '$500 – $1,000', '$1,000 – $2,000', '$2,000 – $3,000', '$3,000+'];
      if (location.currency === 'GBP') return ['Under £500', '£500 – £1,000', '£1,000 – £2,000', '£2,000 – £3,000', '£3,000+'];
      if (location.currency === 'EUR') return ['Under €500', '€500 – €1,000', '€1,000 – €2,000', '€2,000 – €3,000', '€3,000+'];
      const amounts = rangesByCurrency[location.currency] || [500, 1000, 2000, 3000];
      let format;
      try {
        format = new Intl.NumberFormat(`en-${location.region}`, {
          style: 'currency', currency: location.currency, maximumFractionDigits: 0
        });
      } catch {
        format = new Intl.NumberFormat('en', {
          style: 'currency', currency: location.currency, maximumFractionDigits: 0
        });
      }
      return [
        `Under ${format.format(amounts[0])}`,
        `${format.format(amounts[0])} – ${format.format(amounts[1])}`,
        `${format.format(amounts[1])} – ${format.format(amounts[2])}`,
        `${format.format(amounts[2])} – ${format.format(amounts[3])}`,
        `${format.format(amounts[3])}+`
      ];
    };
    let location = { region: 'IN', country: 'India', currency: 'INR', timeZone: '' };
    try { location = detectLocation(); }
    catch { /* Explicit fallback: India and INR; the form remains available. */ }
    if (budget && countryInput && currencyInput) {
      const placeholder = budget.querySelector('option[value=""]') || document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = 'Select budget range';
      placeholder.disabled = true;
      placeholder.selected = true;
      budget.replaceChildren(placeholder);
      budgetOptions(location).forEach((label) => {
        const option = document.createElement('option');
        option.value = label;
        option.textContent = label;
        budget.append(option);
      });
      countryInput.value = location.country;
      currencyInput.value = location.currency;
    }

    const statusLink = (status, message) => {
      const emailLink = document.createElement('a');
      emailLink.href = 'mailto:hello@shopdev.studio';
      emailLink.className = 'studio-text';
      emailLink.textContent = 'hello@shopdev.studio';
      status.replaceChildren(
        document.createTextNode(message),
        emailLink,
        document.createTextNode('.')
      );
    };

    const messages = {
      name: 'Please enter your name.',
      email: 'Please enter a valid email.',
      company: 'Please keep this under 150 characters.',
      website: 'Please enter a full website address, starting with https://.',
      project_type: 'Please select a project type.',
      budget: 'Please select a budget range.',
      details: 'Tell us a little about your project.'
    };
    const validate = (field) => {
      const value = field.value.trim();
      const name = field.name;
      let error = '';
      if (name === 'name' && (!value || value.length > 100)) error = value ? 'Please keep your name under 100 characters.' : messages.name;
      if (name === 'email' && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 255)) error = messages.email;
      if (name === 'company' && value.length > 150) error = messages.company;
      if (name === 'website' && value) {
        try {
          const url = new URL(value);
          if (!/^https?:$/.test(url.protocol) || value.length > 500) error = messages.website;
        } catch {
          error = messages.website;
        }
      }
      if (name === 'project_type' && !field.value) error = messages.project_type;
      if (name === 'budget' && !field.value) error = messages.budget;
      if (name === 'details' && (!value || value.length > 5000)) error = value ? 'Please keep project details under 5,000 characters.' : messages.details;

      const wrapper = field.closest('.form-field');
      let errorNode = wrapper?.querySelector('.form-error');
      if (error && wrapper) {
        if (!errorNode) {
          errorNode = document.createElement('p');
          errorNode.className = 'form-error';
          errorNode.id = `${name}-error`;
          errorNode.setAttribute('role', 'alert');
          wrapper.append(errorNode);
        }
        errorNode.textContent = error;
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorNode.id);
      } else {
        errorNode?.remove();
        field.setAttribute('aria-invalid', 'false');
        field.removeAttribute('aria-describedby');
      }
      return error;
    };

    fields.forEach((field) => {
      field.addEventListener('input', () => validate(field));
      field.addEventListener('change', () => validate(field));
    });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (form.dataset.submitting === 'true') return;
      errorStatus.hidden = true;
      const invalid = fields.filter((field) => validate(field));
      if (invalid.length) {
        invalid[0].focus();
        return;
      }

      const values = Object.fromEntries(new FormData(form).entries());
      const accessKey = window.SHOPDEV_CONTACT_CONFIG?.web3FormsAccessKey?.trim();
      if (!accessKey) {
        statusLink(errorStatus, 'Something went wrong while sending your inquiry. Please try again or email us directly at ');
        errorStatus.hidden = false;
        errorStatus.focus();
        return;
      }

      const subject = values.company
        ? `New ShopDev Project Inquiry — ${values.company}`
        : 'New ShopDev Project Inquiry';
      const message = [
        'New ShopDev Project Inquiry',
        '',
        `Name: ${values.name}`,
        `Email: ${values.email}`,
        `Company / Brand: ${values.company || 'Not provided'}`,
        `Current Website: ${values.website || 'Not provided'}`,
        `Project Type: ${values.project_type}`,
        `Budget Range: ${values.budget}`,
        `Country: ${values.country || location.country}`,
        `Currency: ${values.currency || location.currency}`,
        '',
        'Project Details:',
        values.details
      ].join('\n');
      const payload = {
        access_key: accessKey,
        subject,
        from_name: 'SHOPDEV Website',
        name: values.name,
        email: values.email,
        replyto: values.email,
        company: values.company,
        website: values.website,
        project_type: values.project_type,
        budget: values.budget,
        details: values.details,
        country: values.country || location.country,
        currency: values.currency || location.currency,
        message
      };

      form.dataset.submitting = 'true';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
        if (submitLabel) submitLabel.textContent = 'Sending…';
      }
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload)
        });
        let result = null;
        try { result = await response.json(); }
        catch { /* Treat a non-JSON response as a failed submission below. */ }
        if (!response.ok || !result?.success) throw new Error('Web3Forms submission failed.');

        form.reset();
        form.hidden = true;
        successStatus.hidden = false;
        successStatus.focus();
      } catch {
        statusLink(errorStatus, 'Something went wrong while sending your inquiry. Please try again or email us directly at ');
        errorStatus.hidden = false;
        errorStatus.focus();
      } finally {
        form.dataset.submitting = 'false';
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute('aria-busy');
          if (submitLabel && !form.hidden) submitLabel.textContent = originalSubmitLabel;
        }
      }
    });
  }

  function setupMotion(journey) {
    let stop = () => {};
    const setup = () => {
      stop();
      const reduced = reducedMotion.matches;
      document.body.classList.toggle('motion-ready', !reduced);
      journey.setReduced(reduced);
      if (reduced) {
        document.querySelectorAll('[data-motion]').forEach((element) => element.classList.remove('is-motion-visible'));
        return;
      }

      const visible = new Set();
      let scenes = [];
      let reveals = [];
      let needsMeasure = true;
      let frame = 0;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-motion-visible', entry.isIntersecting);
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        schedule();
      }, { rootMargin: '160px 0px' });

      const measure = () => {
        scenes = [...document.querySelectorAll('[data-motion]')].map((element) => {
          observer.observe(element);
          const rect = element.getBoundingClientRect();
          return { element, top: rect.top + window.scrollY, height: rect.height };
        });
        reveals = [...document.querySelectorAll('.scroll-reveal:not(.in-view)')].map((element) => ({
          element,
          top: element.getBoundingClientRect().top + window.scrollY
        }));
        journey.measure();
        needsMeasure = false;
      };
      const paint = () => {
        frame = 0;
        if (needsMeasure) measure();
        const y = window.scrollY;
        const vh = window.innerHeight;
        reveals = reveals.filter(({ element, top }) => {
          if (top < y + vh * 0.96) {
            element.classList.add('in-view');
            return false;
          }
          return true;
        });
        scenes.forEach(({ element, top, height }) => {
          if (!visible.has(element)) return;
          const progress = clamp((y + vh - top) / (vh + height));
          const enter = clamp((y + vh - top) / (vh * 0.85));
          const pinHeight = element.dataset.motion === 'commerce-statement' ? vh : Math.min(vh, 950);
          const timeline = clamp((y - top) / Math.max(1, height - pinHeight));
          element.style.setProperty('--scene-progress', progress.toFixed(4));
          element.style.setProperty('--scene-enter', enter.toFixed(4));
          element.style.setProperty('--scene-timeline', timeline.toFixed(4));
          element.style.setProperty('--scene-reveal', sceneReveal(timeline).toFixed(4));
        });
        journey.paint();
      };
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(paint);
      };
      const remeasure = () => {
        needsMeasure = true;
        schedule();
      };
      const resize = new ResizeObserver(remeasure);
      resize.observe(document.documentElement);
      const mutations = new MutationObserver(remeasure);
      mutations.observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', remeasure, { passive: true });
      document.addEventListener('load', remeasure, true);
      document.fonts?.ready.then(remeasure);
      schedule();
      stop = () => {
        observer.disconnect();
        resize.disconnect();
        mutations.disconnect();
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', remeasure);
        document.removeEventListener('load', remeasure, true);
        cancelAnimationFrame(frame);
      };
    };

    setup();
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', setup);
    else reducedMotion.addListener(setup);
  }

  setupMobileNavigation();
  setupProcessAccordion();
  setupIndustries();
  setupContactForm();
  setupMotion(setupJourney());
})();
